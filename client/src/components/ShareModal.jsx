import React from "react"
import FontAwesome from "react-fontawesome"
import io from 'socket.io-client';

/**
 * Module to render modal to share puzzle
 * @module shareModal
*/

/**
 * Functional React component for share modal
 * @member shareModal
 * @function ShareModal
 * @param {string} gameId id of game being played
 * @example
 * <WinModal 
	gameId="foobar123" />
 * @returns {React.ReactElement} Share Modal React component to be rendered in the DOM
 */
export default function ShareModal(props) {
	const [hidden, setHidden] = React.useState(false);
	const [copied, setCopied] = React.useState(false);

	const modalStyle = {
		display: hidden ? "none" : "block",
	}

	const copiedAlertStyle = {
		display: copied ? "block" : "none"
	}

	function hideModal() {
		setHidden(true)
	}

	function copyLink() {
		var copyText = document.getElementById("shareLink").innerText;
		navigator.clipboard.writeText(copyText);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, "2000");
	}

	return (
		<div className="share-modal" style={modalStyle}>
			<div className="modal-header">
				<button className="modal-close" onClick={hideModal}>
					<FontAwesome
						name='times'
						size='2x'
					/>
				</button>
			</div>
			<div id="copiedAlert" style={copiedAlertStyle}>Copied!</div>
			<h2>Share this link to play with friends!</h2>
			<hr />
			<h3 id="shareLink">
				http://localhost:5173/?gameId={props.gameId}
			</h3>
			<button onClick={copyLink}>Copy to clipboard</button>
		</div>
	)
}