import { useEffect, useState } from 'react'  

export default function ProgressBar({timer}) {
	const [remainingTime, setReaminingTime] = useState(timer)

	useEffect(() => {
		const interval = setInterval(() => {
			console.log('interval')
			setReaminingTime((prev) => prev - 100)
		}, 100)

		return () => {
			clearInterval(interval)
		}
	}, [])
	return <progress value={remainingTime} max={timer} />

}
