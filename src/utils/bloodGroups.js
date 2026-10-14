export const BLOOD_GROUPS = [
  { value: 'A_POS', label: 'A+' },
  { value: 'A_NEG', label: 'A-' },
  { value: 'B_POS', label: 'B+' },
  { value: 'B_NEG', label: 'B-' },
  { value: 'AB_POS', label: 'AB+' },
  { value: 'AB_NEG', label: 'AB-' },
  { value: 'O_POS', label: 'O+' },
  { value: 'O_NEG', label: 'O-' },
];

export const BLOOD_GROUP_MAP = {
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_NEG: 'B-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-',
  O_POS: 'O+',
  O_NEG: 'O-',
};

export const POPULAR_INDIAN_CITIES = [
  'Hyderabad',
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Kolkata',
  'Pune',
  'Visakhapatnam',
  'Kochi',
];

export const getBloodGroupLabel = (value) => {
  return BLOOD_GROUP_MAP[value] || value;
};

// Recipient -> Compatible Donor Groups
export const COMPATIBILITY_MAP = {
  O_NEG: ['O_NEG'],
  O_POS: ['O_NEG', 'O_POS'],
  A_NEG: ['O_NEG', 'A_NEG'],
  A_POS: ['O_NEG', 'O_POS', 'A_NEG', 'A_POS'],
  B_NEG: ['O_NEG', 'B_NEG'],
  B_POS: ['O_NEG', 'O_POS', 'B_NEG', 'B_POS'],
  AB_NEG: ['O_NEG', 'A_NEG', 'B_NEG', 'AB_NEG'],
  AB_POS: ['O_NEG', 'O_POS', 'A_NEG', 'A_POS', 'B_NEG', 'B_POS', 'AB_NEG', 'AB_POS'],
};

export const getCompatibleDonorLabels = (recipientGroup) => {
  const donorGroups = COMPATIBILITY_MAP[recipientGroup] || [];
  return donorGroups.map((g) => BLOOD_GROUP_MAP[g] || g);
};
