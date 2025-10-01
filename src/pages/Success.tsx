import { useEffect, useState } from "react";
import PixelCard from "../components/PixelCard";
import { checkForSuccess } from "../api/stripe";

const Success = () => {
	const [success, setSuccess] = useState(true);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const sessionId = urlParams.get('session_id');

		if (sessionId !== null) {
			if (sessionId === "free") setSuccess(true);
			else {
				checkForSuccess(sessionId || '').then((data) => {
					setSuccess(data.success);
				});
			}
		} else {
			setSuccess(false);
		}
	}, []);

  return (
		<div className="px-8 h-1/2 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 flex items-center justify-center">
			{success ? (
				<PixelCard className="border-abyzma-light border-2 w-full h-full" colors="#2F4F2F, #0F4F0F, #2F4F2F, #90EE90, #228B22, #90EE90">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center space-y-4 text-center">
						<h1 className="text-6xl font-bold pb-4">Success</h1>
						<p className="text-sm sm:text-base">Your ticket has been purchased successfully</p>
						<p className="text-sm sm:text-base">Thank you for your purchase</p>
						<p className="text-sm sm:text-base">You will receive an email with your ticket</p>
					</div>
				</PixelCard>
			) : (
				<PixelCard className="border-abyzma-light border-2 w-full h-full" variant="pink">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center space-y-4 text-center">
						<h1 className="text-6xl font-bold pb-4">Error</h1>
						<p className="text-sm sm:text-base">Your ticket has not been purchased successfully</p>
						<p className="text-sm sm:text-base">Please try again</p>
						<p className="text-sm sm:text-base">If the problem persists, please contact us</p>
					</div>
				</PixelCard>
			)}
		</div>
  )
}

export default Success;