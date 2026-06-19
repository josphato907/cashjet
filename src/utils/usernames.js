export const EastAfricanUsernames = [
  "David Jimm", "Lopeto", "Hockins", "Cathrene", "Ericktone", "Ciciria", 
  "Wanjiku", "Kamau", "Njeri", "Ochieng", "Akinyi", "Kipchoge", "Chebet", 
  "Mutua", "Nyambura", "Otieno", "Wambui", "Kimani", "Mwangi", "Odhiambo", 
  "Nafula", "Rotich", "Kosgei", "Jepkosgei", "Tanui", "Cherono", "Lagat", 
  "Kiplagat", "Chepkoech", "Kipruto", "Wafula", "Simiyu", "Wekesa", "Masinde", 
  "Barasa", "Wamalwa", "Naliaka", "Nekesa", "Makokha", "Khaemba", "Kariuki", 
  "Kipchirchir", "Kipkemboi", "Kipkemoi", "Kemboi", "Kipkemei", 
  "Samuel Mwangi", "Jane Njoki", "Peter Kariuki", "Susan Wambui", 
  "Joseph Kimani", "Mary Nyambura", "Daniel Kipchoge", "Patricia Chebet", 
  "James Rotich", "Florence Kosgei", "Njoroge", "Githinji", "Maina", "Karanja",
  "Nduta", "Mugo", "Macharia", "Muthoni", "Kibet", "Jepchirchir", "Koech"
];

export const BetAmounts = [50, 100, 120, 140.34, 150, 200, 230, 300, 500, 810, 1000, 1500.63, 2000, 3000];

export function generateRandomUsername() {
  return EastAfricanUsernames[Math.floor(Math.random() * EastAfricanUsernames.length)];
}

export function generateRandomBetAmount() {
  return BetAmounts[Math.floor(Math.random() * BetAmounts.length)];
}
