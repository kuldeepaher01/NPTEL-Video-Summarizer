import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import axios from "axios";
import "./App.css";
import YouTube from "react-youtube";
import YoutubeC from "./Components/YoutubeC";

function App() {
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);
	const [userInput, setUserInput] = useState("");
	const location = useLocation(); // Access the location object
	const videoLink = location.state?.videoLink; // Access the videoLink from the state
	const [variable, setVariable] = useState(60);
	const [videoId, setVideoId] = useState("");
	const endOfMessagesRef = useRef(null);
	const scrollToBottom = () => {
		if (endOfMessagesRef.current) {
			endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const [loading, setLoading] = useState(false);

	console.log(videoLink);
	useEffect(() => {
		function convertToEmbedUrl(watchUrl) {
			return watchUrl.replace("/watch?v=", "/embed/");
		}
		if (videoLink) {
			// setEmbedLink(convertToEmbedUrl(videoLink));
			setVideoId(videoLink.split("v=")[1]);
		} else {
			navigate("/");
		}
	}, []);

	const sendMessage = async () => {
		try {
			console.log("Sending message...");
			setLoading(true);

			const response = await axios.post("http://localhost:5000/message", {
				prompt: userInput,
				messages: messages,
			});
			setMessages([
				...messages,
				{ role: "user", content: userInput },
				{ role: "assistant", content: response.data.assistant_message },
			]);
			setUserInput("");
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && userInput.trim() !== "") {
			sendMessage();
			e.preventDefault(); // To prevent any default behavior, such as a line break in a textarea
		}
	};

	return (
		<div id="App" className="w-full ">
			<div>
				<Navbar />
			</div>
			<div id="chat-ui" className=" grid grid-cols-2 divide-x-2">
				<div className="flex flex-col items-center justify-center">
					<YoutubeC videoId={videoId} navigate={navigate} />
				</div>

				<div className="flex flex-col items-center justify-center">
					<div>
						<h1 className="p-2 text-2xl text-gray-800 font-semibold">
							Chat with the VideoChad
						</h1>
						<div id="chat-mesage-box" className="bg-gray-400 m-4 ">
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Cupiditate aperiam dignissimos expedita eius, commodi quidem
								veritatis accusamus ullam quibusdam laudantium? Totam,
								consequuntur quasi. Perferendis ipsum nisi nemo consequuntur
								magnam cumque?
							</p>
						</div>
					</div>
					<div className="fixed mb-2  bg-white" id="chat-input">
						<input
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your query here..."
							className="flex-grow px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
						/>
						<button
							onClick={sendMessage}
							className={`ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring ${
								loading && "cursor-not-allowed opacity-35"
							}`}
							disabled={loading}
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
