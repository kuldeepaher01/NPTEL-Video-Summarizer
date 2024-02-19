import React from "react";

function Navbar() {
	return (
		<div>
			{" "}
			<header className="sticky top-0 bg-white shadow">
				{" "}
				<div className="flex items-center justify-between p-2 mx-auto max-w-7xl">
					{" "}
					<div className="text-3xl font-bold  bg-indigo-600  hover:bg-indigo-700 rounded-lg hover:cursor-pointer  ">
						<h1 className="p-2">
							<span className="text-white"> VideoChad </span>{" "}
						</h1>
					</div>{" "}
					<button className="btn btn-light">Contact Us</button>{" "}
				</div>{" "}
			</header>{" "}
		</div>
	);
}

export default Navbar;
