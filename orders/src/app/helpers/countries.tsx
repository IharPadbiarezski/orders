import { Country }  from 'country-state-city';

const COUNTRIES = Country.getAllCountries();

const getCountryTelCode = (country: string) => {
  if (country) {
    const selectedCountry = COUNTRIES.find(({ isoCode }) => {
      return (isoCode === country)
    });
    return selectedCountry?.phonecode;
  }
}

export { COUNTRIES, getCountryTelCode };
