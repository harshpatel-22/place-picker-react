import { useCallback, useEffect, useRef, useState } from 'react'

import Places from './components/Places.jsx'
import { AVAILABLE_PLACES } from './data.js'
import Modal from './components/Modal.jsx'
import DeleteConfirmation from './components/DeleteConfirmation.jsx'
import logoImg from './assets/logo.png'
import { sortPlacesByDistance } from './loc.js'

const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
const storedPlaces = storedIds.map((id) => {
	return AVAILABLE_PLACES.find((place) => place.id === id)
})

function App() {
	const modal = useRef()
	const selectedPlace = useRef()
	const [modalIsOpen, setModalIsOpen] = useState(false) // Fixed typo: setModelIsOpen -> setModalIsOpen
	const [pickedPlaces, setPickedPlaces] = useState(storedPlaces)
	const [availablePlaces, setAvailablePlaces] = useState([]) // Fixed typo: setAvailableSpaces -> setAvailablePlaces

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const sortedPlaces = sortPlacesByDistance(
				AVAILABLE_PLACES,
				position.coords.latitude,
				position.coords.longitude
			)
			setAvailablePlaces(sortedPlaces)
		})
	}, [])

	function handleStartRemovePlace(id) {
		setModalIsOpen(true)
		selectedPlace.current = id

		// Set a timer to close the modal after 3 seconds (3000ms)
		const timer = setTimeout(() => {
			handleStopRemovePlace()
		}, 3000)

		// Clean up the timer if the component unmounts or modal closes manually
		modal.current.timer = timer // Store timer ID in ref for cleanup
	}

	function handleStopRemovePlace() {
		setModalIsOpen(false)
		// Clear the timer if it exists to prevent it from running after manual close
		if (modal.current.timer) {
			clearTimeout(modal.current.timer)
		}
	}

	function handleSelectPlace(id) {
		setPickedPlaces((prevPickedPlaces) => {
			if (prevPickedPlaces.some((place) => place.id === id)) {
				return prevPickedPlaces
			}
			const place = AVAILABLE_PLACES.find((place) => place.id === id)
			return [place, ...prevPickedPlaces]
		})

		const storedIds =
			JSON.parse(localStorage.getItem('selectedPlaces')) || []
		if (storedIds.indexOf(id) === -1) {
			localStorage.setItem(
				'selectedPlaces',
				JSON.stringify([id, ...storedIds])
			)
		}
	}

	const handleRemovePlace = useCallback(function handleRemovePlace() {
		setPickedPlaces((prevPickedPlaces) =>
			prevPickedPlaces.filter((place) => {
				return place.id !== selectedPlace.current
			})
		)
		setModalIsOpen(false)
		// Clear the timer if it exists
		if (modal.current.timer) {
			clearTimeout(modal.current.timer)
		}

		const storedIds =
			JSON.parse(localStorage.getItem('selectedPlaces')) || []
		localStorage.setItem(
			'selectedPlaces',
			JSON.stringify(
				storedIds.filter((id) => id !== selectedPlace.current)
			)
		)
	}, [])

	return (
		<>
			<Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
				<DeleteConfirmation
					onCancel={handleStopRemovePlace}
					onConfirm={handleRemovePlace}
				/>
			</Modal>
			<header>
				<img src={logoImg} alt='Stylized globe' />
				<h1>PlacePicker</h1>
				<p>
					Create your personal collection of places you would like to
					visit or you have visited.
				</p>
			</header>
			<main>
				<Places
					title="I'd like to visit ..."
					fallbackText={
						'Select the places you would like to visit below.'
					}
					places={pickedPlaces}
					onSelectPlace={handleStartRemovePlace}
				/>
				<Places
					title='Available Places'
					places={availablePlaces}
					fallbackText='Sorting places by distance...'
					onSelectPlace={handleSelectPlace}
				/>
			</main>
		</>
	)
}

export default App
