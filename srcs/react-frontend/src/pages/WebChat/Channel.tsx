import React, { useState, ChangeEvent, useEffect} from 'react';
import Popup from 'reactjs-popup';
import "./Channel.css";
import { userActions } from '../../_actions';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import {channelActions} from '../../_actions/channel.actions'
import {UpdateUser} from "../../interfaces/iUser";
import {IJoinChan} from "../../interfaces/IJoinChan";
import { users } from '../../_reducers/users.reducer';


function Channel (){
	const [type, setType] = useState("public");
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [usersLogin, setUsersLogin] = useState("");
	const [allChannel, setAllChannel] = useState([]);
	const [inputSearch, setInputSearch] = useState("");
	const dispatch = useAppDispatch();
	const user = useAppSelector<any>(state => state.user);
	const channel = useAppSelector<any>(state => state.channel);
	const owner: UpdateUser = user.data;
	let view;
	let searchView;

	useEffect(()=> {
		dispatch(channelActions.getMyChannelsByType(type));
	},[type]);

	useEffect(()=> {
		setAllChannel(channel.data);
	},[channel.data]);


	const handleChanType = (s: string) => {{
		setType(s);
	}}

	const handleChanName = function (e: ChangeEvent<HTMLInputElement>)  {
		setChanName(e?.currentTarget?.value);
	}

	const handlePassword = function (e: ChangeEvent<HTMLInputElement>)  {
		setPassword(e?.currentTarget?.value);
	}

	const handleUsersLogin = function (e: ChangeEvent<HTMLInputElement>)  {
		setUsersLogin(e?.currentTarget?.value);
	}
	
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setInputSearch(e?.currentTarget?.value);
	}
	
	const search = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(channelActions.getChannel(inputSearch));
	}

	const join = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let join_pass = e.currentTarget.join_pass?.value;
		let join_data :IJoinChan = {
			name: channel.search.name,
		}
		if (type == "protected")
			join_data.password = join_pass;
		else if (type === "private")
			join_data.password = ""

		
		console.log("name entered: " + join_data.name);
		console.log("password entered: " + join_data.password);
		dispatch(channelActions.joinChannel(join_data));
	}

	const createPublicChan = (event: React.FormEvent<HTMLFormElement>) => {
		 dispatch(channelActions.createChannel(
			[],
			'public',
			'',
			chanName,
			owner
		));
	}

	const channelFinded = () => {
		const access : string = channel.search.access;
		const name :string = channel.search.name;
		const userIds = channel.search.userIds;

		return (
			<>
			<p className='mx-2'> {access} channel:</p>
			<p className='mx-3' style={{color : "orange"}}> {name} </p>
			<form onSubmit={join}>
				{access === "protected" &&
					<input name="join_pass" type="password" placeholder='Enter password'/>
				}
				<button onClick={() => join}> Join </button>
			</form>
			<button onClick={() => window.open(window.location.origin + '/chat_room')}>Chat</button>
			</>
		);
	}

	const channelNoFinded = () => {
		return (
			<div className='FriendSearch'>
						<div>
						</div>
			</div> 
		);
	}


	const createProtectChan = (event: React.FormEvent<HTMLFormElement>) => {
		 dispatch(channelActions.createChannel(
			[],
			'protected',
			password,
			chanName,
			owner
		));
	}

	const parseUser = (users:string):string[] => {
		let res :string[];
		res = users.split('/');
		return (res);
	}

	const createPrivateChan = (event: React.FormEvent<HTMLFormElement>) => {
		const users :string[] = parseUser(usersLogin);
		console.log(users);
		 dispatch(channelActions.createChannel(
			users,
			'private',
			'',
			chanName,
			owner
		));
	}


	const displayChannel = () =>{
		return(
			<>
			{channel.data[0] && allChannel && allChannel.map((item: any, i: number) =>
			<div key={i} className='d-flex flex-row border-bottom m-3 justify-content-between'>
				<div className='d-flex flex-row '>
					<p> {item?.name} </p>
				</div>

				<div>
				<button onClick={() => window.open(window.location.origin + '/chat_room')}>Chat</button>
				</div>
				</div>
			)}
			</>
		);
	}
		
	const ViewProtect = () =>{
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Protected channel</p>
				</div>
				<div className='mx-2'>
	
			<Popup trigger={<button className="button"> + </button>} modal>
				<div className='channelPopup'>
					<form onSubmit={createProtectChan} className='d-flex flex-column align-items-center justify-content-center'>
	
						<div>
							<input onChange={handleChanName} type="text" name="type" placeholder='Channel name'/>
						</div>
						<div>
							<input onChange={handlePassword} type="password" name="type" placeholder='Password'/>
						</div>

						<input type="submit" value="Envoyer" />
					</form>
				</div>
			</Popup>
	
				</div>
		</div> 
		
		<div id="allChannel">
			{displayChannel()}
		</div>
		</>
		);
	}
	
	
	const ViewPublic = () => {
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Public channel</p>
				</div>
				<div className='mx-2'>
	
					<Popup trigger={<button className="button"> + </button>} modal>
						<div className='channelPopup'>
							<form onSubmit={createPublicChan} className='d-flex flex-column align-items-center justify-content-center'>
	
								<div>
									<input  onChange={handleChanName} type="text" name="type" placeholder='Channel name'/>
								</div>
			
								<input type="submit" value="Submit"/>
							</form>
						</div>
					</Popup>
				</div>
		</div> 
		
		<div id="allChannel">
			{displayChannel()}
		</div>
		</>
		);
	}
	
	const ViewPrivate = () => {
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Private channel</p>
				</div>
				<div className='mx-2'>
	
					<Popup trigger={<button className="button"> + </button>} modal>
						<div className='channelPopup'>
							<form onSubmit={createPrivateChan} className='d-flex flex-column align-items-center justify-content-center'>
	
								<div>
									<input  onChange={handleChanName} type="text" name="type" placeholder='Channel name'/>
								</div>

								<div className='d-flex flex-column'>
									<input  onChange={handleUsersLogin} type="text" name="type" placeholder='User login'/>
									<label style={{color: "white"}}> format: user1/user2/user3</label>
								</div>
			
								<input type="submit" value="Submit"/>
							</form>
						</div>
					</Popup>
				</div>
		</div> 
		
		<div id="allChannel">
			{displayChannel()}	
		</div>
		</>
		);
	}

	if (type === 'public')
		view = ViewPublic();
	else if (type === 'protected')
		view = ViewProtect();
	else if (type === 'private')
		view = ViewPrivate();

	if (channel && channel.search)
		searchView = channelFinded();
	else
		searchView = channelNoFinded();

	return (
		<div className='webchatDiv3'>

			<div className='webchatDiv3_1'>
				<div className='webchatDiv3_1_1'>
					<div>
						<button onClick={() => handleChanType('public')}> PUBLIC</button>
					</div>
					<div>
						<button onClick={() => handleChanType('protected')}> PROTECTED</button>
					</div>
					<div>
						<button onClick={() => handleChanType('private')}> PRIVATE</button>
					</div>

				</div>
				<div className='webchatDiv3_1_2'>
					<form onSubmit={search}>
						<input onChange={handleSearch} className='mx-3' type="text" placeholder="search channel"/>
					</form>
					{searchView}
				</div>
			</div>

			<div className='webchatDiv3_2'>
				{view}
			</div>

		</div> 
	);
}

export default Channel;