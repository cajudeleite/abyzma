import { useEffect, useState } from 'react';
import {createCheckoutSession} from '../api/stripe';
import { fetchCurrentPhaseTicketsAmount, fetchPhases } from '../api/phase';
import { fetchCupon } from '../api/cupon';
import Stepper, { Step } from '../components/Stepper';
import Magnet from '../components/Magnet';
import Counter from '../components/Counter';
import useIsMobile from '../hooks/useIsMobile';
import type Phase from '../types/phase';

interface CouponData {
	name: string;
	amount: string;
	value: string;
	percentage: boolean;
}

const Checkout = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)
	const [phases, setPhases] = useState<Phase[]>([]);
	const [quantity, setQuantity] = useState(1);
	const [cuponCode, setCuponCode] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [validationError, setValidationError] = useState('');
	const [isMessageVisible, setIsMessageVisible] = useState(false);
	const [currentPhaseTicketsLeft, setCurrentPhaseTicketsLeft] = useState(null);
	const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
	const [couponValidationError, setCouponValidationError] = useState('');
	const [validatedCoupon, setValidatedCoupon] = useState<CouponData | null>(null);
	const isMobile = useIsMobile();

  useEffect(() => {
		fetchCurrentPhaseTicketsAmount().then((data) => setCurrentPhaseTicketsLeft(data.tickets_left));

    // Check for success or cancel parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setMessage('Payment successful! Thank you for your purchase.');
      setIsMessageVisible(true);
    } else if (urlParams.get('canceled') === 'true') {
      setMessage('Payment canceled. You can try again.');
      setIsMessageVisible(true);
    }

		fetchPhases().then((data) => {			
			setPhases(data);
		});
  }, []);

  // Auto-dismiss message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsMessageVisible(false);
        // Clear message after fade out animation completes
        setTimeout(() => setMessage(''), 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

	const activePhase = phases.find(phase => phase.active) || { price: 0 };

	// Calculate discounted price based on coupon
	const calculatePrice = () => {
		const basePrice = activePhase.price;
		if (!validatedCoupon) return basePrice;
		
		const { value, percentage } = validatedCoupon;
		if (percentage) {
			// Percentage discount: reduce by percentage
			return basePrice * (1 - parseFloat(value) / 100);
		} else {
			// Fixed price: the value is the new price
			return parseFloat(value);
		}
	};

	const discountedPrice = calculatePrice();
	const maxQuantityFromCoupons = validatedCoupon ? parseInt(validatedCoupon.amount) : null;
	const effectiveMaxQuantity = maxQuantityFromCoupons ? Math.min(maxQuantityFromCoupons, currentPhaseTicketsLeft || Infinity) : currentPhaseTicketsLeft;

  // Adjust quantity if it exceeds coupon limit
  useEffect(() => {
    if (validatedCoupon && maxQuantityFromCoupons && quantity > maxQuantityFromCoupons) {
      setQuantity(maxQuantityFromCoupons);
    }
  }, [validatedCoupon, quantity, maxQuantityFromCoupons]);

  const handleCheckout = async () => {
    setIsLoading(true);
    setMessage('');
    setIsMessageVisible(false);

    try {
      const { checkoutUrl } = await createCheckoutSession(
        quantity, 
        name, 
        email, 
        validatedCoupon ? cuponCode : undefined
      );
      // Redirect to Stripe's hosted checkout page
      window.location.href = checkoutUrl;
    } catch {
      setMessage('Failed to create checkout session. Please try again.');
      setIsMessageVisible(true);
      setIsLoading(false);
    }
  };

	// Async coupon validation function
	const validateCoupon = async () => {
		if (!cuponCode.trim()) {
			setCouponValidationError('Please enter a coupon code');
			return false;
		}

		setIsValidatingCoupon(true);
		setCouponValidationError('');

		try {
			const couponData = await fetchCupon(cuponCode);
			setValidatedCoupon(couponData);
			setCouponValidationError('');
			return true;
		} catch {
			setCouponValidationError('Invalid coupon code');
			setValidatedCoupon(null);
			return false;
		} finally {
			setIsValidatingCoupon(false);
		}
	};

	// Validation function for stepper steps
	const validateStep = (step: number): boolean => {
		switch (step) {
			case 1: // Welcome step - always valid
				return true;
			case 2: // Cupon code step - check if coupon is validated (if provided)
				if (cuponCode.trim() && !validatedCoupon) {
					setValidationError('Please validate your coupon code before proceeding');
					return false;
				}
				setValidationError('');
				return true;
			case 3: // Quantity step - always valid (has default quantity)
				return true;
			case 4: // Personal info step - validate name and email
				if (name.trim().length === 0) {
					setValidationError('Please enter your name');
					return false;
				}
				if (email.trim().length === 0) {
					setValidationError('Please enter your email');
					return false;
				}
				if (!email.includes('@')) {
					setValidationError('Please enter a valid email address');
					return false;
				}
				setValidationError('');
				return true;
			case 5: // Payment step - always valid (validation happens in payment)
				return true;
			default:
				return true;
		}
	};

  return <>
		<Magnet padding={500} disabled={isMobile} magnetStrength={10}>
			<Stepper
				initialStep={1}
				onFinalStepCompleted={handleCheckout}
				backButtonText="Previous"
				nextButtonText="Next"
				className="w-[90dvw]"
				stepCircleContainerClassName="border-abyzma-light border-2 bg-abyzma-dark"
				validateStep={validateStep}
				nextButtonProps={{ className: 'bg-abyzma-light text-abyzma-dark font-bold text-xl px-2 py-1 rounded-md' }}
			>
				<Step>
					<h2 className="text-2xl font-bold mb-4">Welcome to the checkout form</h2>
					<p>Here you'll be able to buy your tickets for Roots of the Fall, Abyzma's dark experimental gathering</p>
				</Step>
				<Step>
					<h2 className="text-2xl font-bold mb-4">Cupon code (optional):</h2>
					<div className="space-y-4">
						<input 
							type="text" 
							placeholder="Cupon Code" 
							className="w-full p-2 rounded-md border-abyzma-light border-2" 
							value={cuponCode} 
							onChange={(e) => { 
								setCuponCode(e.target.value); 
								setValidationError(''); 
								setCouponValidationError('');
								setValidatedCoupon(null);
							}} 
						/>
						{cuponCode.trim() && (
							<button
								onClick={validateCoupon}
								disabled={isValidatingCoupon}
								className="w-full bg-abyzma-light text-abyzma-dark font-bold px-4 py-2 rounded-md hover:bg-abyzma-light/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								{isValidatingCoupon ? 'Validating...' : 'Validate Coupon'}
							</button>
						)}
						{validatedCoupon && (
							<div className="text-green-500 text-sm">
								✓ Coupon validated successfully!
							</div>
						)}
						{couponValidationError && (
							<div className="text-red-500 text-sm">
								{couponValidationError}
							</div>
						)}
						{validationError && (
							<div className="text-red-500 text-sm">
								{validationError}
							</div>
						)}
					</div>
				</Step>
				<Step>
					<h2 className="text-2xl font-bold mb-4">Choose the quantity of tickets:</h2>
					<div className="flex">
						<div className="space-y-4 border-r-2 border-abyzma-light pr-8 mr-8 flex flex-col justify-center">		
							{phases.map((phase, index) => {
								const activePhaseIndex = phases.findIndex(p => p.active);
								const isBeforeActive = activePhaseIndex !== -1 && index < activePhaseIndex;
								
								return (
									<div key={phase.name} className={`${phase.active ? 'text-lg font-bold' : 'text-sm'} ${isBeforeActive ? 'line-through' : ''}`}>
										{phase.active && validatedCoupon ? <>
											<p className='text-nowrap'>{phase.name}: <span className='line-through text-sm'>{phase.price}€</span> → {discountedPrice}€</p>
											<p className="text-xs text-end">
												{validatedCoupon.percentage ? `${validatedCoupon.value}% off` : "Special price"}
											</p>
										</>:
											<p>{phase.name}: {phase.price}€</p>
										}
									</div>
								);
							})}
						</div>
						<div className="flex flex-col justify-between space-y-4">	
							<div className="flex items-center gap-2">
								<button disabled={quantity === 1} className="bg-abyzma-light text-abyzma-dark text-2xl font-extrabold px-3 pb-1 rounded-md" onClick={() => setQuantity(quantity - 1)}>-</button>
								<Counter
									value={quantity}
									places={[10, 1]}
									fontSize={45}
									padding={5}
									gap={10}
									textColor="#d7cec7"
									fontWeight={900}
									gradientFrom='transparent'
								/>
								<button 
									disabled={quantity === effectiveMaxQuantity} 
									className="bg-abyzma-light text-abyzma-dark text-2xl font-extrabold px-2 pb-1 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed" 
									onClick={() => setQuantity(quantity + 1)}
								>+</button>
							</div>
							<div className="text-lg text-right">
								<div>Total: <span className="font-bold">{quantity * discountedPrice}€</span></div>
								{validatedCoupon && (
									<div className="text-xs">
										Saved: {(quantity * activePhase.price - quantity * discountedPrice).toFixed(2)}€
									</div>
								)}
							</div>
						</div>
					</div>
				</Step>
				<Step>
					<h2 className="text-2xl font-bold mb-4">Provide your personal information:</h2>
					<div className="flex flex-col gap-4">
						<input type="text" placeholder="Name" className="w-full p-2 rounded-md border-abyzma-light border-2" value={name} onChange={(e) => { setName(e.target.value); setValidationError(''); }} />
						<input type="email" placeholder="Email" className="w-full p-2 rounded-md border-abyzma-light border-2" value={email} onChange={(e) => { setEmail(e.target.value); setValidationError(''); }} />
						{validationError && (
							<div className="text-red-500 text mt-2">
								{validationError}
							</div>
						)}
					</div>
				</Step>
				<Step>
					<div className="bg-gray-800 p-6 rounded-lg">
						<h2 className="text-xl font-semibold mb-4">Abyzma Ticket</h2>
						<p className="text-gray-300 mb-4">Ticket for the event</p>
						<div className="mb-6">
							{validatedCoupon ? (
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span>Original price:</span>
										<span className="line-through text-gray-400">{quantity * activePhase.price}€</span>
									</div>
									<div className="flex justify-between items-center">
										<span>Discount ({validatedCoupon.percentage ? `${validatedCoupon.value}%` : `Special price`}):</span>
										<span className="text-red-400">-{(quantity * activePhase.price - quantity * discountedPrice).toFixed(2)}€</span>
									</div>
									<div className="border-t pt-2 flex justify-between items-center">
										<span className="text-xl font-bold">Total:</span>
										<span className="text-2xl font-bold text-green-400">{quantity * discountedPrice}€</span>
									</div>
								</div>
							) : (
								<p className="text-2xl font-bold">{quantity * discountedPrice}€</p>
							)}
						</div>
						
						<button
							onClick={handleCheckout}
							disabled={isLoading}
							className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
						>
							{isLoading ? 'Processing...' : 'Pay with Stripe'}
						</button>
					</div>
				</Step>
			</Stepper>
		</Magnet>

		{message && (
			<div className={`mb-6 p-4 rounded text-center transition-opacity duration-300 ${
				isMessageVisible ? 'opacity-100' : 'opacity-0'
			} ${
				message.includes('successful') 
					? 'bg-green-100 text-green-800' 
					: 'bg-yellow-100 text-yellow-800'
			}`}>
				{message}
			</div>
		)} 
  </>
}

export default Checkout