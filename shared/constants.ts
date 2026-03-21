// Comprehensive Configuration

const colorPalette = {
  primary: '#ff5733',
  secondary: '#33c1ff',
  accent: '#ffc300',
};

const typography = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  fontWeight: 'normal',
};

const spacing = {
  small: '8px',
  medium: '16px',
  large: '24px',
};

const institutionalData = {
  name: 'Institution Name',
  address: '123 Main St, City, Country',
  contactNumber: '+123456789',
};

const routes = {
  home: '/home',
  about: '/about',
  contact: '/contact',
};

const navigationItems = [
  { name: 'Home', path: routes.home },
  { name: 'About', path: routes.about },
  { name: 'Contact', path: routes.contact },
];

const areaColorsMapping = {
  area1: '#ff0000',
  area2: '#00ff00',
  area3: '#0000ff',
};

const authenticationConfig = {
  loginUrl: '/api/login',
  logoutUrl: '/api/logout',
};

const indicatorsConfig = {
  salesIndicator: 'sales',
  growthIndicator: 'growth',
};

const contactConfig = {
  email: 'info@institution.com',
  supportNumber: '+123456789',
};

const timeConfig = {
  timezone: 'UTC',
  defaultFormat: 'YYYY-MM-DD HH:MM:SS',
};

const defaultValues = {
  itemsPerPage: 10,
  maxAttempts: 3,
};

export {
  colorPalette,
  typography,
  spacing,
  institutionalData,
  routes,
  navigationItems,
  areaColorsMapping,
  authenticationConfig,
  indicatorsConfig,
  contactConfig,
  timeConfig,
  defaultValues,
};