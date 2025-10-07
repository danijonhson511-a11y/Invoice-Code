export function createPageUrl(pageName) {
  const routes = {
    Landing: '/',
    Dashboard: '/dashboard',
    Generator: '/generator',
    ViewInvoice: '/view-invoice',
  };
  return routes[pageName] || '/';
}
