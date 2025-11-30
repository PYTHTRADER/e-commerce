
import { Order, User } from '../types';

// Simulated Backend Service

export const sendOrderConfirmationEmail = async (email: string, order: Order) => {
  console.group('%c [BACKEND] Sending Email', 'color: cyan; font-weight: bold;');
  console.log(`To: ${email}`);
  console.log(`Subject: Order Confirmation #${order.id}`);
  console.log(`Body:`);
  console.log(`Hi ${order.customerName},`);
  console.log(`Thank you for your order! We are packing your peanut butter now.`);
  console.log(`Order Total: ₹${order.total}`);
  console.log(`Items:`);
  order.items.forEach(item => {
    console.log(`- ${item.name} (${item.variantWeight}) x ${item.quantity}`);
  });
  console.groupEnd();
  
  // Simulate network delay
  return new Promise(resolve => setTimeout(resolve, 800));
};

export const processPayment = async (amount: number, method: string) => {
  console.log(`[BACKEND] Processing payment of ₹${amount} via ${method}`);
  return new Promise(resolve => setTimeout(resolve, 1500));
};
