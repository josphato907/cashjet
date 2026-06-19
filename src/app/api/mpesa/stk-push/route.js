import { NextResponse } from 'next/server';

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

    // Simulate a successful STK push response
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const merchantRequestId = `${Math.floor(Math.random() * 100000)}-${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 10)}`;

    const message = `STK push has been sent to ${phoneNumber}. If the STK prompt doesn't appear within 30 seconds, please try again.`;

    console.log('[CashJet STK] STK Push successful:', { checkoutRequestId });

    return NextResponse.json({
      success: true,
      checkoutRequestId,
      merchantRequestId,
      message,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
      customerMessage: message,
    });

  } catch (error) {
    console.error('[CashJet STK] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing payment request' },
      { status: 500 }
    );
  }
}
