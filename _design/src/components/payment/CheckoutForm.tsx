import React, { useState } from 'react';
import { CreditCard, Calendar, Lock, User, Flag } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';

interface CheckoutFormProps {
  onPaymentComplete: (bookingId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onPaymentComplete }) => {
  const { selectedSeats, selectedEvent, createBooking } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingZip: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = Math.round(totalAmount * 0.12);
  const finalTotal = totalAmount + serviceFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Use MM/YY format';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    
    if (!formData.billingZip) {
      newErrors.billingZip = 'Billing ZIP is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real application, you would send payment info to a payment processor
      // Here we just simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create booking
      const booking = await createBooking();
      
      onPaymentComplete(booking.id);
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedEvent || selectedSeats.length === 0) {
    return <div>No seats selected</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-600 text-white p-4">
          <h2 className="text-lg font-semibold">Secure Checkout</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Payment summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium mb-3">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Event:</span>
              <span className="font-medium">{selectedEvent.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tickets:</span>
              <span className="font-medium">{selectedSeats.length} x Various Prices</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tickets Subtotal:</span>
              <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service Fee:</span>
              <span className="font-medium">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-primary-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Card information */}
          <h3 className="text-md font-medium mb-4">Payment Information</h3>
          
          <div className="mb-4">
            <label htmlFor="cardName" className="label flex items-center">
              <User className="h-4 w-4 mr-1" />
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              className={`input ${errors.cardName ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="cardNumber" className="label flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="expiryDate" className="label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={`input ${errors.expiryDate ? 'border-red-500' : ''}`}
                placeholder="MM/YY"
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label htmlFor="cvv" className="label flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                className={`input ${errors.cvv ? 'border-red-500' : ''}`}
                placeholder="123"
                maxLength={3}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="billingZip" className="label flex items-center">
              <Flag className="h-4 w-4 mr-1" />
              Billing ZIP Code
            </label>
            <input
              type="text"
              id="billingZip"
              name="billingZip"
              value={formData.billingZip}
              onChange={handleInputChange}
              className={`input ${errors.billingZip ? 'border-red-500' : ''}`}
              placeholder="10001"
            />
            {errors.billingZip && <p className="text-red-500 text-xs mt-1">{errors.billingZip}</p>}
          </div>
          
          <div className="flex items-start mb-6">
            <input
              id="terms"
              type="checkbox"
              required
              className="mt-0.5"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex items-center">
              <Lock className="h-4 w-4 mr-1 text-green-500" />
              Secured by 256-bit encryption
            </div>
            <button
              type="submit"
              className={`btn-primary px-6 py-3 ${isProcessing ? 'opacity-80' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay $${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;