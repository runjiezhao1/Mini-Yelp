import {React, useState} from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";

import "../styles/Sihuo.css"

function Box() {
    
	const [body, api] = useBox(() => ({ mass: 0, position: [0, 1.75, 0] }));
    const [head, api1] = useBox(() => ({ mass: 0, position: [0, 3, 0] }));
    const [leftArm, setLeftArm] = useBox(() => ({ mass: 0, position: [-1.5, 1, 0],  rotation:[0,0,Math.PI / 3]}));
    const [rightArm, setRightArm] = useBox(() => ({ mass: 0, position: [1.5, 1, 0],  rotation:[0,0,-Math.PI / 3]}));
    const [leftLeg, setLeftLeg] = useBox(() => ({ mass: 0, position: [-0.4, -1, 0],  rotation:[0,0,Math.PI / 2]}));
    const [rightLeg, setRightLeg] = useBox(() => ({ mass: 0, position: [0.4, -1, 0],  rotation:[0,0,-Math.PI / 2]}));
    const [rightEye, setRightEye] = useBox(() => ({ mass: 0, position: [-0.25, 3, 0.31]}));
    const [leftEye, setleftEye] = useBox(() => ({ mass: 0, position: [0.25, 3, 0.31]}));
    const [rightEyeBack, setRightEyeBack] = useBox(() => ({ mass: 0, position: [-0.25, 3, 0.305]}));
    const [leftEyeBack, setleftEyeBack] = useBox(() => ({ mass: 0, position: [0.25, 3, 0.305]}));
	return (
        <group position={[0,5,0]}>
            {/* <mesh onClick={() => {api.velocity.set(0, 2, 0);}} ref={ref} position={[0, 2, 0]}>
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="hotpink" />
		    </mesh> */}
            <mesh ref={head} scale={[1,1,1]}>
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="black" />
            </mesh>
            <mesh ref={body} scale={[1.5,1.5,0.5]}>
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="black" />
            </mesh>
            <mesh ref={leftArm} scale={[3,0.5,0.5]} >
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="black" />
            </mesh>
            <mesh ref={rightArm} scale={[3,0.5,0.5]} >
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="black" />
            </mesh>
            <mesh ref={leftLeg} scale={[4,0.5,0.5]} >
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="black" />
            </mesh>
            <mesh ref={rightLeg} scale={[4,0.5,0.5]} >
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="black" />
            </mesh>
            <mesh ref={leftEye} scale={[0.2,0.2,0.4]}>
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="purple" />
            </mesh>
            <mesh ref={rightEye} scale={[0.2,0.2,0.4]}>
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="purple" />
            </mesh>
            <mesh ref={rightEyeBack} scale={[0.4,0.2,0.4]}>
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="white" />
            </mesh>
            <mesh ref={leftEyeBack} scale={[0.4,0.2,0.4]}>
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="white" />
            </mesh>
        </group>
            
	);
}



function Plane() {
	const [ref] = usePlane(() => ({
		rotation: [-Math.PI / 2, 0, 0],
	}));
	return (
		<mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
			<planeBufferGeometry attach="geometry" args={[100, 100]} />
			<meshLambertMaterial attach="material" color="lightblue" />
		</mesh>
	);
}

export default function Sihuo(){
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const _onMouseMove = (e)=> {
        setX(e.screenX);
        setY(e.screenY);
        console.log(x);
    }

    return (
        <div class="App">
            <Canvas class="canvasSize" onMouseMove={(e)=>_onMouseMove(e)}>
		 <OrbitControls />
		<Stars />
		<ambientLight intensity={0.5} />
		<spotLight position={[10, 15, 10]} angle={0.3} />
		<Physics>
			<Box />
			<Plane />
		</Physics>
	    </Canvas>
        </div>
        
    );
}