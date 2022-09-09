import React, { useEffect, useState } from 'react';

// Image
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../_actions';
import { MDBBadge, MDBBtn, MDBIcon, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import axios from 'axios';

/*
	<img
	src={ avatarPath }
	alt=''
	style={{ width: '45px', height: '45px' }}
	className='rounded-circle'
	/>
*/

function Leaderboard(){ 
	const dispatch = useAppDispatch();
	const authentication = useAppSelector<any>(state => state.authentication);
	const user = useAppSelector<any>(state => state.user);
	const navigate = useNavigate();
	const users = useAppSelector<any>(state => state.users);
	const alert = useAppSelector<any>(state => state.alert);

	useEffect(() => {
		document.title = "Leaderboard";
	}, [])

	interface Data {
		login: string;
		wins: number;
		loses: number;
		score: number;
	}

	const [ladder, setladder] = useState<Data[]>([]);
	
	useEffect(() => {
	if(!authentication.loggedIn && !authentication.loggingIn && !authentication.initial)
		navigate("/");
	}, [authentication])

	//Geting rank position
	useEffect(() => {
		axios.get("http://localhost:3002/users/ladder")
			.then((res: any) => {
				const ladder = res.data;
				console.log(ladder)
				setladder(ladder);
			})
			.catch(() => {})
	}, []);

	//Geting performance
	let performance = 100;
	if (user?.data?.wins !== 0 || user?.data?.loses !== 0)
			performance = Math.floor((user?.data?.wins / (user?.data?.wins + user?.data?.loses)) * 100);

	return (
	<>
	{ authentication.loggedIn &&
		<>
		<div className="p-5 bd-highlight justify-content-center d-flex">
        	
        		<div className="d-flex flex-column align-items-center justify-content-center w-75">
              		<p className="register_btn">
            			raking Requiest
            		</p>
            	
			</div>
		</div>
		<div className="bd-highlight justify-content-center d-flex">
			<div className="bd-highlight justify-content-center d-flex">
			<MDBTable align='middle'>
				<MDBTableHead>
					<tr>
					<th scope='col'>#</th>
					<th scope='col'>Login</th>
					<th scope='col'>Wins</th>
					<th scope='col'>Losses</th>
					<th scope='col'>Score</th>
					<th scope='col'>View Profile</th>
					</tr>
				</MDBTableHead>
				<MDBTableBody>
				{ ladder && ladder.map((item: Data, i:number) =>
					<tr key={item.login}>
						<td> {i + 1} </td>
						<td>
							<div className='d-flex align-items-center'>
							<div className='ms-3'>
								<p className='fw-bold mb-1'>{item.login}</p>
							</div>
							</div>
						</td>
						<td>
							<MDBBadge color='success' pill>
							{item.wins}
							</MDBBadge>
						</td>
						<td>
							<MDBBadge color='danger' pill>
							{item.loses} 
							</MDBBadge>
						</td>
						<td>{item.score}</td>
						<td>
							<MDBBtn color='link' rounded size='sm' href={"/profile/" + item.login}>
							View
							</MDBBtn>
						</td>
					</tr>
				)}
				</MDBTableBody>
			</MDBTable>
			</div>
		</div>
		</>
	}
	</>
	);
}

export default Leaderboard;
