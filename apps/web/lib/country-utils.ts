import * as ct from "countries-and-timezones";

const TIMEZONE_OVERRIDES: Record<string, string> = {
  "Europe/Kiev": "Europe/Sofia"
};

export function getCountryFromTimezone(timezone?: string) {
  if (!timezone) return null;

  const mappedTimezone = TIMEZONE_OVERRIDES[timezone] ?? timezone;
  const timezoneInfo = ct.getTimezone(mappedTimezone);
  const countryCode = timezoneInfo?.countries?.[0];
  if (!countryCode) return null;

  const country = ct.getCountry(countryCode);
  return {
    code: countryCode,
    name: country?.name || countryCode
  };
}

export function getCountryFlagUrl(countryCode: string) {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}
