export function truncateAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  export function formatDeadline(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleString();
  }