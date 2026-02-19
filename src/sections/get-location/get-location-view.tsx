import { Box, Button, Typography } from '@mui/material';

import useGeolocation from 'src/hooks/use-geolocation';

export default function GetLocationView() {

    const { location, error } = useGeolocation();

    const openMap = () => {
        let url = '';
        if (location?.latitude && location?.longitude) {
            // url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
            url = encodeURI(`https://www.google.com/maps?q=13.692002892659579,100.31037828226704&z=15`);
            // url = encodeURI(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
            // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;
            fetch(url).then(res => res.json()).then(data => {
                console.log(data)
            })
            window.open(url, "_blank");
        }

    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>User Location</Typography>

            {location ? (
                <Box>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </Box>
            ) : (
                <Box>Loading...</Box>
            )}
            {error && <Box style={{ color: "red" }}>{error}</Box>}
            <Button
                variant='contained'
                onClick={() => openMap()}
            >
                เปิด map
            </Button>
        </Box>
    );
};

