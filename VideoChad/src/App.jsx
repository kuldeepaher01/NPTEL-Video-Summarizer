import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import axios from "axios";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";

function App() {
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [timestamps, setTimestamps] = useState([]);
	const location = useLocation();
	const videoLink = location.state?.videoLink;
	const metaData = location.state?.metaData;
	const [videoId, setVideoId] = useState("");
	const endOfMessagesRef = useRef(null);
	const [player, setPlayer] = React.useState(null);

	const handleClick = () => {
		console.log("Clicked");
		if (player) {
			player.seekTo(120);
			player.pauseVideo();
			console.log("Seeking to  120");
		}
	};

	const onPlayerReady = (event) => {
		setPlayer(event.target);
		console.log("Player is ready");
	};
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
			// setEmbedLink(convertToEmbedUrl(videoLink));
			setVideoId(videoLink.split("v=")[1]);
			console.log(videoId);
		} else {
			// navigate("/");
		}
	}, []);

	const sendMessage = async () => {
		try {
			console.log("Sending message...");
			setLoading(true);
			let formattedMessages = [];
			for (let i = 0; i < messages.length; i += 2) {
				let message = [];
				message.push(messages[i].content);
				message.push(messages[i + 1].content);
				formattedMessages.push(message);
			}
			console.log("Formatted", formattedMessages);
			const formattedInput =
				userInput +
				"?. In bulleted points, respond with the key points of the answer for the question and provide a concise answer in markdown format highlighting the keypoints and features using markdown.";
			const response = await axios.post("http://localhost:5000/response", {
				query: formattedInput,
				chat_history: formattedMessages,
			});
			console.log("Answer", response.data.answer);
			console.log("Time sta", response.data.timestamps);
			setTimestamps(response.data.timestamps.slice(0, 5));
			setMessages([
				...messages,
				{ role: "user", content: userInput + "?" },
				{ role: "assistant", content: response.data.answer },
			]);

			console.log(messages);
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
	const markdown = "";

	useEffect(() => {
		async function fetchSummary() {
			try {
				console.log("Summarizing...");
				setLoading(true);
				const response = await axios.post("http://localhost:5000/response", {
					query:
						"You are a Intelligent Tutor. Your task is to smartly summarize the the Youtube video transcript provided as context. \
					Don't mention the transcript as 'transcript' but refer to it as Youtube video or just video while having a conversation with a student.\
					Give me in-depth response for the summaray part only... something like : Short-Intro to what is being said in the video transcript.\
					5 - KEY points to understand in bullet point format... Conclusion as to what can be learnt from this video transcript....\
					Only the Conclusion in the summary should be application perspective.... \
					From thsi point provide all the responses in this chat in Markdown Format highlighting keypoints and fetures. Also for every response you have to give introduction, keypoints and conclusion. Keep in mind that the markdown syntax should be followed for every response that you will give in fututre.",
					chat_history: "",
				});
				console.log("Answer", response.data.answer);
				console.log("Time stamp", response.data.timestamps);

				// setTimestamps(response.data.timestamps);
				// only set first five timestamps
				setTimestamps(response.data.timestamps.slice(0, 5));
				setMessages([
					...messages,
					{ role: "user", content: userInput },
					{ role: "assistant", content: response.data.answer },
				]);

				console.log(messages);
				setUserInput("");
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		}
		fetchSummary();
	}, []);

	return (
		<div id="App" className="w-full h-screen">
			<div>
				<Navbar />
			</div>
			<div id="chat-ui" className="grid grid-cols-2 divide-x-2 h-5/6">
				<div className="flex flex-col  lg:col-span-1 col-span-2">
					<div className=" w-full h-96 justify-center items-center">
						<h1 className="text-gray-800 font-semibold text-2xl ml-2 mt-2">
							{metaData}
						</h1>

						<YouTube
							className="flex w-full h-full p-2 justify-center items-center"
							videoId={videoId}
							opts={{
								width: "100%",
								height: "120%",
								playerVars: {
									autoplay: 0,
									start: 40,
								},
							}}
							onReady={onPlayerReady}
						/>

						{/* <div className="flex justify-center items-center mt-32">
							<button
								className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-2.5 rounded-lg"
								onClick={handleClick}
							>
								Quiz Me! ⭐🧐
							</button>
						</div> */}
					</div>
				</div>

				<div className="flex flex-col  justify-between lg:col-span-1 col-span-2 overflow-auto">
					<h1 className="p-2 text-2xl text-gray-800 font-semibold text-center">
						📺 Chat with the Video 📺
					</h1>
					<div className="p-2">
						<div className="flex items-center justify-start flex-col max-h-3/5">
							<div
								ref={endOfMessagesRef}
								className=" p-4 flex flex-col m-4 w-full max-h-4/5 border text-xl border-gray-300 rounded-md bg-gray-100"
								id="chat-message"
							>
								<div>
									<ReactMarkdown>{"# Markdown"}</ReactMarkdown>
								</div>
								{messages.map((msg, idx) => (
									<div
										key={idx}
										className={` ${
											msg.role === "user"
												? "text-indigo-600 font-bold mt-3"
												: "text-gray-700  "
										}`}
										ref={idx === messages.length - 1 ? endOfMessagesRef : null}
									>
										<ReactMarkdown className="markdown">
											{msg.content}
										</ReactMarkdown>
										{/* Show buttopns of 3 timestamps  */}
										{/* {msg.content} */}
										{msg.role === "assistant" && (
											<div className="flex space-x-4 mt-2">
												{timestamps.map((time, idx) => (
													<button
														key={idx}
														className="bg-indigo-200 hover:bg-indigo-400  text-white py-1 px-3 rounded-lg"
														onClick={() => {
															if (player) {
																player.seekTo(time);
																player.pauseVideo();
															}
														}}
													>
														{"Ref "}
														{idx + 1}
													</button>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
					<div
						className="p-2 absolute w-full bg-white"
						id="chat-input"
						style={{ position: "sticky", bottom: 0 }}
					>
						<div className="flex items-center justify-end w-full space-x-4">
							<input
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="🤔 Ask me anything! ... "
								className="flex-grow w-5/6 px-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
							/>
							{/* {loading && (
								<div
									style={{ position: "relative", right: "640px", top: "50%" }}
									className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"
								></div>
							)} */}
							<button
								onClick={sendMessage}
								className={`px-2.5 py-2.5 bg-indigo-600 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring ${
									loading && "cursor-not-allowed opacity-35 "
								}`}
								disabled={loading}
							>
								📤Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
