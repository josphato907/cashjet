import { NextResponse } from 'next/server';

function normalizePhone(phone) {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // Remove leading zeros
  while (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  
  if (digits.startsWith('254')) {
    return digits;
  }
  
  if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
    return '254' + digits;
  }
  
  // fallback: if it doesn't match standard, prepending 254
  if (!digits.startsWith('254') && digits.length > 0) {
    return '254' + digits;
  }
  
  return digits;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, transactionType, accountReference } = body;

    console.log('[CashJet STK] Initiating STK Push:', { phone: phoneNumber, amount, type: transactionType });

    // Validate basic fields
    if (!phoneNumber || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number or amount' },
        { status: 400 }
      );
    }

    const payheroUrl = process.env.PAYHERO_API_URL || 'https://backend.payhero.co.ke/api/v2/payments';
    const username = process.env.PAYHERO_API_USERNAME;
    const password = process.env.PAYHERO_API_PASSWORD;
    const channelId = process.env.PAYHERO_CHANNEL_ID;
    const callbackUrl = process.env.PAYHERO_CALLBACK_URL || '';
    const basicAuthToken = process.env.BASIC_AUTH_TOKEN;

    if (!channelId || (!basicAuthToken && (!username || !password))) {
      console.error('[CashJet STK] Missing PayHero configuration environment variables');
      return NextResponse.json(
        { success: false, message: 'Payment gateway configuration is missing on the server.' },
        { status: 500 }
      );
    }

    const phone = normalizePhone(phoneNumber);
    if (!/^254[17][0-9]{8}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Kenyan phone number format. Use 07XXXXXXXX or 01XXXXXXXX.' },
        { status: 400 }
      );
    }

    // Prepare authorization header
    let authHeader = basicAuthToken;
    if (!authHeader && username && password) {
      authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    }

    const payload = {
      amount: Math.round(parseFloat(amount)),
      phone_number: phone,
      channel_id: /^\d+$/.test(channelId) ? parseInt(channelId, 10) : channelId,
      provider: "m-pesa",
      external_reference: accountReference || `DEP-${Date.now()}`,
      callback_url: callbackUrl,
      description: transactionType === 'deposit' ? 'CashJet Deposit' : 'CashJet Withdrawal'
    };

    console.log('[CashJet STK] Sending PayHero payload:', { ...payload, phone_number: '***' });

    const response = await fetch(payheroUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    console.log('[CashJet STK] PayHero response status:', response.status);
    const data = await response.json();

    if (response.ok && data.success !== false) {
      const checkoutRequestId = data.CheckoutRequestID || data.checkoutRequestId || `ws_CO_${Date.now()}`;
      const merchantRequestId = data.MerchantRequestID || data.merchantRequestId || '';
      
      console.log('[CashJet STK] STK Push successful:', { checkoutRequestId });

      return NextResponse.json({
        success: true,
        checkoutRequestId,
        merchantRequestId,
        message: data.CustomerMessage || data.ResponseDescription || data.message || `STK push sent to ${phone}`,
      });
    } else {
      console.error('[CashJet STK] PayHero API Error:', data);
      return NextResponse.json({
        success: false,
        message: data.message || data.ResponseDescription || 'Failed to send STK prompt. Please check your number and try again.',
        detail: data
      }, { status: response.status || 400 });
    }

  } catch (error) {
    console.error('[CashJet STK] Exception in STK Push:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Server error processing payment request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
    },
  });
}

