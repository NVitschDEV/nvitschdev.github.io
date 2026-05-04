import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const Model = ({ url }: { url: string }) => {
  const gltf = useLoader(GLTFLoader, url);
  const ref = useRef<THREE.Group>(null);

  const cloned = useMemo(() => {
    const source = (gltf.scene || gltf.scenes[0]) as THREE.Group;
    const group = source.clone(true);

    // Recenter & scale to fit a ~3 unit box
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const wrapper = new THREE.Group();
    group.position.sub(center);
    wrapper.add(group);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3 / maxDim;
    wrapper.scale.setScalar(scale);

    wrapper.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return wrapper;
  }, [gltf]);

  useEffect(() => () => {
    cloned.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh) {
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      }
    });
  }, [cloned]);

  return <primitive ref={ref} object={cloned} />;
};

const LoadingFallback = () => (
  <Html center>
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      loading model…
    </span>
  </Html>
);

export const ModelViewer = ({ url }: { url: string }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3.5, 2.4, 4.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color={"#ffd9a8"} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.55} color={"#9bbcff"} />
      <Suspense fallback={<LoadingFallback />}>
        <Model url={url} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minDistance={2.2}
        maxDistance={9}
      />
    </Canvas>
  );
};
