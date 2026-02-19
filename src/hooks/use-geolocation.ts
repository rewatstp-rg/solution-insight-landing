import { useState, useEffect } from "react";

interface Location {
    latitude: number;
    longitude: number;
}

const useLiveLocation = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported");
            return;
        }

        let watchId;

        navigator.permissions
            .query({ name: "geolocation" })
            .then((permission) => {
                if (permission.state === "denied") {
                    setError("Location permission denied. Enable it in browser settings.");
                    return;
                }

                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (errorx: any) => {
                        setError(errorx.message);
                    }
                );
            });

        // eslint-disable-next-line consistent-return
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    return { location, error };
};

export default useLiveLocation;
