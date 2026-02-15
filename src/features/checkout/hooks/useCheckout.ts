'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import * as checkoutApi from '../api/api';
import { validateCheckoutForm } from '../schema';
import type {
  CheckoutFormErrors,
  Order,
  PaymentMethod,
  ShippingAddress,
} from '../types/types';

export function useCheckout() {
  const router = useRouter();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>(
    'shipping'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const [shippingAddress, setShippingAddress] = useState<
    Partial<ShippingAddress>
  >({});
  const [paymentMethod, setPaymentMethod] = useState<Partial<PaymentMethod>>(
    {}
  );
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] =
    useState(true);
  const [billingAddress, setBillingAddress] = useState<
    Partial<ShippingAddress>
  >({});

  /**
   * Validate and move to next step
   */
  const nextStep = useCallback(() => {
    if (step === 'shipping') {
      const shippingErrors = validateCheckoutForm(shippingAddress, {});
      if (shippingErrors.shippingAddress) {
        setErrors(shippingErrors);
        return;
      }
      setErrors({});
      setStep('payment');
    } else if (step === 'payment') {
      const formErrors = validateCheckoutForm(
        shippingAddress,
        paymentMethod,
        billingAddressSameAsShipping ? undefined : billingAddress
      );
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
      setErrors({});
      setStep('review');
    }
  }, [
    step,
    shippingAddress,
    paymentMethod,
    billingAddressSameAsShipping,
    billingAddress,
  ]);

  /**
   * Move to previous step
   */
  const prevStep = useCallback(() => {
    if (step === 'payment') {
      setStep('shipping');
    } else if (step === 'review') {
      setStep('payment');
    }
  }, [step]);

  /**
   * Submit order
   */
  const submitOrder = useCallback(async (): Promise<Order | null> => {
    setIsLoading(true);
    setErrors({});

    try {
      const order = await checkoutApi.submitCheckout({
        shippingAddress: shippingAddress as ShippingAddress,
        paymentMethod: paymentMethod as PaymentMethod,
        billingAddressSameAsShipping,
        billingAddress: billingAddressSameAsShipping
          ? undefined
          : (billingAddress as ShippingAddress),
      });

      // Redirect to success page
      router.push(`/orders/${order.id}/success`);
      return order;
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Failed to submit order',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [
    shippingAddress,
    paymentMethod,
    billingAddressSameAsShipping,
    billingAddress,
    router,
  ]);

  return {
    step,
    isLoading,
    errors,
    shippingAddress,
    paymentMethod,
    billingAddressSameAsShipping,
    billingAddress,
    setShippingAddress,
    setPaymentMethod,
    setBillingAddressSameAsShipping,
    setBillingAddress,
    nextStep,
    prevStep,
    submitOrder,
  };
}
