import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
	apiKey: 'AIzaSyAIydqhwy20JwMCc0uTjJo3814esS8Y9L0',
	authDomain: 'internetendcreditchat.firebaseapp.com',
	databaseURL: 'https://internetendcreditchat.firebaseio.com',
	projectId: 'internetendcreditchat',
	storageBucket: 'internetendcreditchat.appspot.com',
	messagingSenderId: '714304685529',
	appId: '1:714304685529:web:90c6cbeea0c36f9e1e05c8',
	measurementId: 'G-ML4KENBJ28',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const SignIn = () => {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};
	return <button onClick={signInWithGoogle}> Sign in with Google</button>;
};

const SignOut = () => {
	return (
		auth.currentUser && (
			<button onClick={() => auth.signOut()}> Sign Out</button>
		)
	);
};

const ChatMessage = (props: any) => {
	const { text, uid, photoURL } = props.message;
	const messageStyle = uid === auth.currentUser?.uid ? 'sent' : 'received';
	return (
		<div className={`message ${messageStyle}`}>
			<img src={photoURL} alt='profile pic' />
			<p>{text}</p>
		</div>
	);
};

const Chatroom = () => {
	const dummy = useRef<HTMLDivElement>(null);
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(25);
	const [messages] = useCollectionData(query, { idField: 'id' });
	const [formValue, setFormValue] = useState('');

	const sendMessage = async (e: any) => {
		e.preventDefault();
		const { uid, photoURL } = auth.currentUser!;
		await messagesRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid,
			photoURL,
		});
		setFormValue('');
		if (dummy && dummy.current) {
			dummy.current.scrollIntoView({ behaviour: 'smooth' } as ScrollIntoViewOptions);
		}
	};
	return (
		<>
			<SignOut />
			<main>
				{messages &&
					messages.map((msg: any) => (
						<ChatMessage key={msg.id} message={msg} />
					))}
				<div ref={dummy}></div>
			</main>
			<form action='' onSubmit={sendMessage}>
				<input
					type='text'
					value={formValue}
					onChange={e => setFormValue(e.target.value)}
				/>
				<button type='submit'>
					send message{' '}
					<span role='img' aria-label='mail'>
						📧
					</span>
				</button>
			</form>
		</>
	);
};

function App() {
	const [user] = useAuthState(auth);

	return (
		<div>
				<section>{user ? <Chatroom /> : <SignIn />}</section>
		</div>
	);
}

export default App;
