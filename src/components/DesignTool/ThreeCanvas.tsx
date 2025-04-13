import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Plane, Grid } from '@react-three/drei'
import * as THREE from 'three'
import SunCalc from 'suncalc'
import { RoofConfig } from './DesignTool'

// Constants for solar panel calculations
const PANEL_EFFICIENCY = 0.2 // 20% efficiency for modern solar panels
const SOLAR_IRRADIANCE = 1000 // W/m² (standard solar irradiance)

// Bangkok Coordinates
const BANGKOK_LAT = 13.7563
const BANGKOK_LON = 100.5018

// --- Helper Function to create Roof Geometry ---
function createRoofGeometry(config: RoofConfig): THREE.BufferGeometry | THREE.Group {
  const { type, width, length, roofHeight } = config

  switch (type) {
    case 'shed':
      // Simple Shed Example (sloping along length)
      const shedGeometry = new THREE.PlaneGeometry(width, length)

      // Use the user-defined roof height or default to 30 degree tilt
      let shedHeight = 2; // Default height if not specified
      let shedAngle = -Math.PI / 6; // Default 30 degree tilt

      if (roofHeight) {
        shedHeight = roofHeight;
        // Calculate angle based on roof height and length
        shedAngle = -Math.atan2(length, roofHeight);
      }

      // Tilt it - adjust rotation based on 'direction' later
      shedGeometry.rotateX(shedAngle)
      // shedGeometry.translate(0, shedHeight / 2, 0) // Lift based on height
      return shedGeometry

    case 'gable':
      // Gable roof - two sloped planes meeting at a ridge
      // Use user-defined roof height or default
      const actualRoofHeight = roofHeight || Math.min(width, length) * 0.3;
      const group = new THREE.Group()
      const halfLength = length / 2
      const slopeLength = Math.sqrt(halfLength * halfLength + actualRoofHeight * actualRoofHeight)

      // Calculate the angle needed for the planes to meet at the ridge
      // This is the angle between the sloped plane and the horizontal plane (base)
      // Use atan2 for numerical stability (handles halfLength = 0 case)
      const slopeAngle = Math.atan2(halfLength, actualRoofHeight)

      // Create two sloped planes
      const plane1 = new THREE.PlaneGeometry(width, slopeLength)
      plane1.rotateX(-slopeAngle)

      const plane2 = new THREE.PlaneGeometry(width, slopeLength)
      plane2.rotateX(slopeAngle) // Opposite direction tilt

      // Create a shared material for both planes
      const roofMaterial = new THREE.MeshStandardMaterial({
        color: '#dadada',
        side: THREE.DoubleSide
      });

      // Add planes to group with proper positioning to ensure they connect at the ridge
      const mesh1 = new THREE.Mesh(plane1, roofMaterial)
      const mesh2 = new THREE.Mesh(plane2, roofMaterial)

      // Position the planes to meet at the ridge
      mesh1.position.set(0, 0, halfLength / 2)
      mesh2.position.set(0, 0, -halfLength / 2)

      group.add(mesh1)
      group.add(mesh2)

      return group

    case 'flat':
    default:
      const flatGeometry = new THREE.PlaneGeometry(width, length)
      flatGeometry.rotateX(-Math.PI / 2) // Lay flat on XZ plane
      return flatGeometry
  }
}

interface RoofProps {
  config: RoofConfig
}

// --- Roof Component ---
const Roof: React.FC<RoofProps> = ({ config }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Recreate geometry only when config changes
  const roofObject = useMemo(() => createRoofGeometry(config), [config])

  // Determine if we're dealing with a Group or BufferGeometry
  const isGroup = useMemo(() => roofObject instanceof THREE.Group, [roofObject])

  // Rotate roof based on direction (assuming Y is up)
  // 0 degrees = North (positive Z), 180 = South (negative Z)
  const rotationY = useMemo(
    () => THREE.MathUtils.degToRad(180 - config.direction),
    [config.direction],
  )

  useEffect(() => {
    if (isGroup && groupRef.current) {
      groupRef.current.rotation.y = rotationY
    } else if (!isGroup && meshRef.current) {
      meshRef.current.rotation.y = rotationY
    }
  }, [rotationY, isGroup])

  // Render either a Group or a Mesh based on what createRoofGeometry returned
  return isGroup ? (
    <group ref={groupRef} castShadow>
      {/* The Group already contains meshes with materials from createRoofGeometry */}
      {(roofObject as THREE.Group).children.map((child, index) => (
        <primitive key={index} object={child} />
      ))}
    </group>
  ) : (
    <mesh ref={meshRef} geometry={roofObject as THREE.BufferGeometry} castShadow>
      <meshStandardMaterial color="#bbbbbb" side={THREE.DoubleSide} />
    </mesh>
  )
}

interface SunProps {
  simulationTime: Date
  config: RoofConfig
}

// --- Sun Simulation ---
const Sun: React.FC<SunProps> = ({ simulationTime, config }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const sunMeshRef = useRef<THREE.Mesh>(null)

  const sunPosition = useMemo(() => {
    const sunPos = SunCalc.getPosition(simulationTime, BANGKOK_LAT, BANGKOK_LON)
    // Convert altitude/azimuth to Cartesian coordinates for Three.js
    // Azimuth: 0 = N, PI/2 = E, PI = S, 3*PI/2 = W
    // Altitude: 0 = horizon, PI/2 = zenith
    const distance = 500 // Arbitrary distance for the light source

    // Position needs adjustment based on Three.js coordinate system (Y-up default)
    // Let's adjust azimuth: 0=S, PI/2=E, PI=N, 3PI/2=W
    const adjustedAzimuth = sunPos.azimuth + Math.PI
    const cartesianX = distance * Math.cos(sunPos.altitude) * Math.sin(adjustedAzimuth)
    const cartesianY = distance * Math.sin(sunPos.altitude)
    const cartesianZ = distance * Math.cos(sunPos.altitude) * Math.cos(adjustedAzimuth)

    return new THREE.Vector3(cartesianX, cartesianY, cartesianZ)
  }, [simulationTime])

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(sunPosition)
      lightRef.current.target.position.set(0, 0, 0) // Point light at the origin
      lightRef.current.target.updateMatrixWorld() // Important for shadow camera
    }
    if (sunMeshRef.current) {
      sunMeshRef.current.position.copy(sunPosition)
    }
  }, [sunPosition])

  return (
    <>
      <directionalLight
        ref={lightRef}
        intensity={2.5} // Adjust intensity
        color={0xffffff}
        castShadow
        // shadow-mapSize-width={2048} // Higher res shadows
        // shadow-mapSize-height={2048}
        // shadow-camera-near={0.5}
        // shadow-camera-far={150}
        // shadow-camera-left={-config.width * 1.5 || -15} // Adjust shadow camera frustum
        // shadow-camera-right={config.width * 1.5 || 15}
        // shadow-camera-top={config.length * 1.5 || 15}
        // shadow-camera-bottom={-config.length * 1.5 || -15}
      />
      {/* Optional: visual sun sphere */}
    </>
  )
}

// Calculate solar panel wattage based on roof configuration and sun position
function calculateSolarPanelWattage(roofConfig: RoofConfig, sunPosition: THREE.Vector3): number {
  const { type, width, length, direction, roofHeight } = roofConfig

  // Calculate roof area based on type
  let effectiveArea = 0
  let roofTilt = 0

  switch (type) {
    case 'flat':
      effectiveArea = width * length
      roofTilt = 0 // Flat roof has 0 tilt
      break
    case 'shed':
      effectiveArea = width * length
      // Use user-defined roof height or default
      const shedHeight = roofHeight || 2;
      roofTilt = Math.atan2(shedHeight, length) // Calculate tilt based on height
      break
    case 'gable':
      // For gable, we have two planes, each with half the length
      const actualRoofHeight = roofHeight || Math.min(width, length) * 0.3;
      const halfLength = length / 2
      const slopeLength = Math.sqrt(halfLength * halfLength + actualRoofHeight * actualRoofHeight)
      effectiveArea = width * slopeLength * 2 // Both sides
      roofTilt = Math.atan2(actualRoofHeight, halfLength)
      break
    case 'hip':
      // For hip, we have four planes
      const hipHeight = Math.min(width, length) * 0.25
      // Approximate the area of the four sloped planes
      effectiveArea = width * hipHeight * 2 + length * hipHeight * 2
      roofTilt = Math.PI / 4 // 45 degrees tilt
      break
  }

  // Calculate the angle of incidence between sun and roof normal
  // For simplicity, we'll use the roof direction and tilt to create a normal vector
  const roofNormal = new THREE.Vector3(0, 1, 0) // Start with up vector

  // Apply roof tilt (rotation around X axis)
  if (type !== 'flat') {
    // For non-flat roofs, we need to consider which side of the roof gets more sun
    // This is a simplified calculation
    const directionRadians = THREE.MathUtils.degToRad(direction)
    const sunAzimuth = Math.atan2(sunPosition.x, sunPosition.z)

    // Check if sun is more on the front or back side of the roof
    const angleDiff = Math.abs(directionRadians - sunAzimuth)
    if (angleDiff < Math.PI / 2 || angleDiff > (3 * Math.PI) / 2) {
      // Sun is more on the front side, tilt the normal forward
      roofNormal.z = Math.sin(roofTilt)
      roofNormal.y = Math.cos(roofTilt)
    } else {
      // Sun is more on the back side, tilt the normal backward
      roofNormal.z = -Math.sin(roofTilt)
      roofNormal.y = Math.cos(roofTilt)
    }

    // Rotate the normal based on roof direction
    const rotationMatrix = new THREE.Matrix4().makeRotationY(directionRadians)
    roofNormal.applyMatrix4(rotationMatrix)
  }

  // Normalize the vectors
  roofNormal.normalize()
  const sunDirection = sunPosition.clone().normalize()

  // Calculate the cosine of the angle between the sun direction and roof normal
  let cosIncidence = sunDirection.dot(roofNormal)

  // If the sun is below the roof plane, no energy is generated
  cosIncidence = Math.max(0, cosIncidence)

  // Calculate the wattage
  // Formula: Area * Panel Efficiency * Solar Irradiance * cos(incidence angle)
  const wattage = effectiveArea * PANEL_EFFICIENCY * SOLAR_IRRADIANCE * cosIncidence

  // Convert to kilowatts
  return wattage / 1000
}

interface ThreeCanvasProps {
  roofConfig: RoofConfig
  simulationTime: Date
  onWattageCalculated?: (wattage: number) => void
}

// --- Main Canvas Component ---
const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  roofConfig,
  simulationTime,
  onWattageCalculated,
}) => {
  // Calculate sun position
  const sunPosition = useMemo(() => {
    const sunPos = SunCalc.getPosition(simulationTime, BANGKOK_LAT, BANGKOK_LON)
    // Convert altitude/azimuth to Cartesian coordinates for Three.js
    const distance = 80 // Arbitrary distance for the light source
    const adjustedAzimuth = sunPos.azimuth + Math.PI
    const cartesianX = distance * Math.cos(sunPos.altitude) * Math.sin(adjustedAzimuth)
    const cartesianY = distance * Math.sin(sunPos.altitude)
    const cartesianZ = distance * Math.cos(sunPos.altitude) * Math.cos(adjustedAzimuth)

    return new THREE.Vector3(cartesianX, cartesianY, cartesianZ)
  }, [simulationTime])

  // Calculate wattage
  useEffect(() => {
    if (onWattageCalculated) {
      const wattage = calculateSolarPanelWattage(roofConfig, sunPosition)
      onWattageCalculated(wattage)
    }
  }, [roofConfig, sunPosition, onWattageCalculated])

  return (
    <Canvas shadows camera={{ position: [0, 15, 20], fov: 50 }}>
      <color attach="background" args={['#lightblue']} />
      <ambientLight intensity={0.4} />

      {/* Pass the pre-calculated sun position to the Sun component */}
      <directionalLight position={sunPosition} intensity={0.1 * sunPosition.z} color={0xffffff} castShadow />

      {/* Visual sun sphere */}
      <mesh position={sunPosition} scale={5}>
        <sphereGeometry />
        <meshBasicMaterial color="yellow" />
      </mesh>

      <Roof config={roofConfig} />
      <mesh position={[10, -5, 0]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      {/* Ground Plane */}
      <Grid infiniteGrid cellColor={'gray'} sectionThickness={0} position={[0, -5, 0]}>

      </Grid>

      <OrbitControls />
      {/* Optional: Axes Helper for debugging */}
      {/* <axesHelper args={[5]} /> */}
    </Canvas>
  )
}

export default ThreeCanvas
