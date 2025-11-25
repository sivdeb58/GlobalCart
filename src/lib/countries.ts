
export type Country = {
  name: string;
  code: string;
  currency: string;
  flag: string;
};

export const countries: Country[] = [
  { name: 'United States', code: 'US', currency: 'USD', flag: '🇺🇸' },
  { name: 'India', code: 'IN', currency: 'INR', flag: '🇮🇳' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', currency: 'CAD', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', currency: 'AUD', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', currency: 'EUR', flag: '🇩🇪' },
  { name: 'France', code: 'FR', currency: 'EUR', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', currency: 'JPY', flag: '🇯🇵' },
  { name: 'Brazil', code: 'BR', currency: 'BRL', flag: '🇧🇷' },
  { name: 'South Africa', code: 'ZA', currency: 'ZAR', flag: '🇿🇦' },
  { name: 'Anguilla', code: 'AI', currency: 'XCD', flag: '🇦🇮' },
  { name: 'Antigua and Barbuda', code: 'AG', currency: 'XCD', flag: '🇦🇬' },
  { name: 'Argentina', code: 'AR', currency: 'ARS', flag: '🇦🇷' },
  { name: 'Armenia', code: 'AM', currency: 'AMD', flag: '🇦🇲' },
  { name: 'Aruba', code: 'AW', currency: 'AWG', flag: '🇦🇼' },
];
