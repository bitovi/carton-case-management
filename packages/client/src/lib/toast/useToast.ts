import { useToastContext } from './ToastContext';

/**
 * Hook to access toast notification functions
 * 
 * @returns {object} Toast control functions
 * @returns {function} showToast - Show a toast notification
 * @returns {function} hideToast - Hide the currently visible toast
 * 
 * @throws {Error} If used outside of ToastProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showToast } = useToast();
 * 
 *   const handleSuccess = () => {
 *     showToast({
 *       variant: 'success',
 *       title: 'Success!',
 *       message: 'Your changes have been saved.',
 *     });
 *   };
 * 
 *   return <button onClick={handleSuccess}>Save</button>;
 * }
 * ```
 */
export function useToast() {
  return useToastContext();
}
