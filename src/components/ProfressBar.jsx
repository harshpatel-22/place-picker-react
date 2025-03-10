import { useEffect, useState } from 'react'

export default function ProgressBar({ timer }) {
	const [remainingTime, setRemainingTime] = useState(timer)

	useEffect(() => {
		// Reset remaining time to the initial timer value when the component mounts or timer changes
		setRemainingTime(timer)

		// Set up an interval to decrease the remaining time every 100ms
		const interval = setInterval(() => {
			setRemainingTime((prev) => {
				if (prev <= 0) {
					clearInterval(interval) // Stop the interval when time runs out
					return 0
				}
				return prev - 100 // Decrease by 100ms
			})
		}, 100)

		// Cleanup: Clear the interval when the component unmounts or timer changes
		return () => {
			clearInterval(interval)
		}
	}, [timer])

	return (
		<progress
			value={remainingTime}
			max={timer}
			style={{ width: '100%', height: '20px' }} // Optional: Styling for visibility
		/>
	)
}
