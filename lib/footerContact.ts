export const FOOTER_CONTACT = {
  email: "hi@thailandkitchens.com",
  mobileWhatsapp: "+66 99 359 6916",
  contactPhone: "+66 64 683 9777",
  facebook: "https://www.facebook.com/ThailandKitchens/",
  whatsapp: "https://wa.me/66993596916",
  instagramUrl: "",
  xUrl: "",
  offices: [
    {
      labelKey: "samuiOffice" as const,
      address: "Route 4169, Mae Nam, Amphoe Ko Samui, Surat Thani 84330",
    },
    {
      labelKey: "phuketOffice" as const,
      address: "Royal Phuket Marina, Building MS2, Ko Kaeo, Mueang, Phuket 83000",
    },
    {
      labelKey: "pattayaOffice" as const,
      address:
        "82, 48-49 Chaiyaphruek 2 Rd, Pattaya City, Bang Lamung District, Chon Buri 20150",
    },
  ],
} as const;

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
