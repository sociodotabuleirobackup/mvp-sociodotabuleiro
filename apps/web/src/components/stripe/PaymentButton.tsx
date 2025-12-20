import React, { useState } from 'react';
import { stripeApi, handleApiError } from '../../lib/apiClient';

interface PaymentButtonProps {
  amount: number;
  transactionType: 'TABLE_RESERVATION' | 'RPG_SESSION' | 'FOOD_ORDER';
  destinationUserId: string;
  productName: string;
  productDescription?: string;
  bookingId?: string;
  foodOrderId?: string;
  className?: string;
  children?: React.ReactNode;
}

const transactionLabels: Record<string, string> = {
  TABLE_RESERVATION: 'Reserva de Mesa',
  RPG_SESSION: 'Sessão de RPG',
  FOOD_ORDER: 'Pedido de Comida',
};

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  transactionType,
  destinationUserId,
  productName,
  productDescription,
  bookingId,
  foodOrderId,
  className = '',
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await stripeApi.createPayment({
        amount,
        transactionType,
        destinationUserId,
        productName,
        productDescription,
        bookingId,
        foodOrderId,
      });

      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            Processando...
          </>
        ) : (
          children || (
            <>
              <span className="material-symbols-outlined text-sm">payment</span>
              Pagar {formatCurrency(amount)}
            </>
          )
        )}
      </button>
      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
};
