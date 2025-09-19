// Utility to clear localStorage for debugging
export const clearAllStorage = () => {
  localStorage.removeItem('registeredUsers');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  console.log('All localStorage cleared');
};

export const viewStorageData = () => {
  console.log('=== Current localStorage Data ===');
  console.log('registeredUsers:', localStorage.getItem('registeredUsers'));
  console.log('token:', localStorage.getItem('token'));
  console.log('user:', localStorage.getItem('user'));
  console.log('cart:', localStorage.getItem('cart'));
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  window.clearStorage = clearAllStorage;
  window.viewStorage = viewStorageData;
}
