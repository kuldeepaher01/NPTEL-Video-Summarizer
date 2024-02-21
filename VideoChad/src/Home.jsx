import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Alert from "./Components/Alert";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const [userInput, setUserInput] = useState("");
	const navigate = useNavigate();
	const [alert, setAlert] = useState({
		state: false,
		type: "",
		message: "",
	});

	const handleInputChange = (e) => {
		setUserInput(e.target.value);
	};

	const isValidYouTubeURL = () => {
		const youtubePattern =
			/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&\S*)?$/;
		return userInput.match(youtubePattern);
	};

	const handleSendClick = () => {
		if (isValidYouTubeURL()) {
			setAlert({ state: false, type: "", message: "" });
			const response = axios.post("http://localhost:5000/init", {
				yt_link: userInput,
			});
			console.log("Sent YT link :)", response);
			navigate("/app", { state: { videoLink: userInput } });
		} else {
			setAlert({
				state: true,
				type: "danger",
				message: "Please enter a valid video link",
			});
		}
	};

	return (
		<div>
			<Navbar />
			{alert.state && (
				<Alert
					message={alert.message}
					type={alert.type}
					setState={setAlert}
					timer={5000}
				/>
			)}
			<div className={`${alert.state ? "opacity-40 cursor-not-allowed" : ""}`}>
				<div id="info">
					<header className="bg-gray-50">
						<div className="mx-auto max-w-screen-xl m-4">
							<div className="sm:flex sm:items-center sm:justify-between">
								<div className="text-left sm:text-left">
									<h1 className=" text-5xl font-bold text-gray-900 sm:text-3xl">
										Welcome to Video Chad!
									</h1>

									<p className="mt-1.5 text-md text-gray-500">
										Chat with NPTEL videos! 🎉
									</p>
								</div>

								<div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
									<button
										className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-3 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
										type="button"
										onClick={() =>
											window.open("https://nptel.ac.in/course.html", "_blank")
										}
									>
										<span className="text-sm font-medium"> Go To NPTEL </span>

										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</header>
				</div>
				{/* What is NPTEL and what does this tool do */}
				<div className="mx-auto max-w-screen-xl">
					<div className="sm:flex sm:items-center sm:justify-between">
						<div className=" sm:text-left">
							<h1 className=" text-5xl font-bold text-gray-900 sm:text-3xl text-left ">
								What is NPTEL?
							</h1>

							<p className="mt-1.5 text-md text-gray-500 text-justify">
								NPTEL is a joint initiative of the IITs and IISc. Through this
								initiative, we offer online courses and certification in various
								topics. We believe that access to knowledge and opportunities is
								a basic right. We are committed to making this knowledge
								available to as many people as possible. Our goal is to reach
								out to the learners and provide them with the opportunity to
								learn from the best.
							</p>
							{/* This is an AI tool which will help you summarise long NPTEL educational Videos ndd then Chat with them, write how this will help in learning and understanding */}
							<h1 className=" text-5xl font-bold text-gray-900 sm:text-3xl mt-2">
								How will this tool help you?
							</h1>
							<p className="mt-1.5 text-md text-gray-500 text-justify">
								This tool will help you summarise long NPTEL educational Videos
								and then Chat with them. This will help in learning and
								understanding the content in a better way.{" "}
							</p>
						</div>
					</div>
				</div>
				<div>
					{/* input for nptel video link (YT) */}
					<div className="mt-4 flex flex-row items-center justify-center align-middle space-x-4 ">
						<div className="mt-4 w-9/12">
							<input
								type="text"
								placeholder="Enter a YouTube video link"
								className="w-full px-2 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
								value={userInput}
								onChange={handleInputChange}
							/>
						</div>

						<div className="mt-4">
							<button
								className=" px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring"
								onClick={handleSendClick}
							>
								Chat Now
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
