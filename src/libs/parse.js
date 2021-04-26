import { Types } from 'mongoose';

const getBooleanIfValid = (value, defaultValue = null) => {
  if (value === 'true' || value === 'false') {
    return value === 'true';
  }
  return typeof value === 'boolean' ? value : defaultValue;
};

const getString = value => (value || '').toString();

const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value);

const getNumberIfValid = value => (isNumber(value) ? parseFloat(value) : null);

const getNumberIfPositive = value => {
  const n = getNumberIfValid(value);
  return n && n >= 0 ? n : null;
};

const getArrayIfValid = value => {
  return Array.isArray(value) ? value : null;
};

const getCustomerAddress = address => {
  const coordinates = {
    latitude: '',
    longitude: '',
  };

  if (address && address.coordinates) {
    coordinates.latitude = address.coordinates.latitude;
    coordinates.longitude = address.coordinates.longitude;
  }

  return address
    ? {
        _id: new Types.ObjectID(),
        full_name: getString(address.full_name),
        address1: getString(address.address1),
        address2: getString(address.address2),
        city: getString(address.city),
        country: getString(address.country).toUpperCase(),
        postal_code: getString(address.postal_code),
        state: getString(address.state),
        phone: getString(address.phone),
        company: getString(address.company),
        tax_number: getString(address.tax_number),
        coordinates,
        details: address.details,
        default_billing: false,
        default_shipping: false,
      }
    : {};
};

const getDateIfValid = value => {
  const date = Date.parse(value);
  return isNaN(date) ? null : new Date(date);
};

export default {
  getBooleanIfValid,
  getCustomerAddress,
  getString,
  getNumberIfPositive,
  getDateIfValid,
  getArrayIfValid,
};
