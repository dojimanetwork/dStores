export const validateWebsite = (data: any) => {
  const errors: string[] = [];
  
  if (!data.template && !data.aiGenerated) {
    errors.push('Please select a template or generate with AI');
  }
  
  return errors;
};

export const validateProducts = (data: any) => {
  const errors: string[] = [];
  
  if (!data.importMethod) {
    errors.push('Please select an import method');
  }
  
  if (data.importMethod === 'manual' && (!data.items || data.items.length === 0)) {
    errors.push('Please add at least one product');
  }
  
  return errors;
};

export const validateShipping = (data: any) => {
  const errors: string[] = [];
  
  if (!data.providers || data.providers.length === 0) {
    errors.push('Please select at least one shipping provider');
  }
  
  return errors;
};

export const validatePayments = (data: any) => {
  const errors: string[] = [];
  
  if (!data.providers || data.providers.length === 0) {
    errors.push('Please select at least one payment provider');
  }
  
  return errors;
};

export const validateDomain = (data: any) => {
  const errors: string[] = [];
  
  if (!data.name) {
    errors.push('Please enter a domain name');
  } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(data.name)) {
    errors.push('Please enter a valid domain name');
  }
  
  return errors;
}; 