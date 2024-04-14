import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { SimplifiedPlaylist } from "spotify-types";

const cardSize = 300;

export function PlaylistElement({ playlist, callback }: { playlist: SimplifiedPlaylist, callback: (playlist: SimplifiedPlaylist) => void }) {
  return (
    <Card sx={{ maxWidth: cardSize, margin: "auto" }}>
      <CardActionArea onClick={() => callback(playlist)}>
        <CardMedia
          component="img"
          height="100%"
          image={playlist.images[0].url}
          alt={"Playlist " + playlist.name}
        />
        <CardContent>
          <Typography noWrap textAlign="center" gutterBottom variant="h5" component="div">
            {playlist.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card >
  );
}
