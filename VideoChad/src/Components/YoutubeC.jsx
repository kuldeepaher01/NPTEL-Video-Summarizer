import React from "react";

function YoutubeC({ embedLink }) {
	return (
		<div className="w-1/2 bg-white p-4">
			<iframe
				className="w-full h-96"
				src={embedLink}
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
}

export default YoutubeC;
