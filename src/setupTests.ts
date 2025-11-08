import '@testing-library/jest-dom';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.prototype.observe = jest.fn();
mockIntersectionObserver.prototype.unobserve = jest.fn();
mockIntersectionObserver.prototype.disconnect = jest.fn();
window.IntersectionObserver = mockIntersectionObserver;