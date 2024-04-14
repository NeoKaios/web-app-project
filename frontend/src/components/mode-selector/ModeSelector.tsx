import { Grid } from "@mui/material";
import { ModeCard } from "..";
import BookIcon from '@mui/icons-material/Book';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { HARDCORE_URL, PROGRESSION_URL, TRAIN_URL } from "../../lib/consts";
import { SimplifiedPlaylist } from "spotify-types";

export function ModeSelector({ selectedPlaylist }: { selectedPlaylist: SimplifiedPlaylist }) {
  const learningIcon = (<BookIcon sx={{
    fontSize: "15vmin"
  }} />);
  const trainingIcon = (<SportsEsportsIcon sx={{
    fontSize: "15vmin"
  }} />);
  const challengeIcon = (<SportsScoreIcon sx={{
    fontSize: "15vmin"
  }} />);

  return (
    <Grid container
      justifyContent="center"
      spacing={2}
      maxWidth="1000px">
      <ModeCard image={learningIcon}
        title="Study"
        description="Learn your songs in an adaptative manner using an anki-based approach."
        href={PROGRESSION_URL(selectedPlaylist.id)}
      />
      <ModeCard image={trainingIcon}
        title="Training"
        description="Train yourself in a quizz-like fashion"
        href={TRAIN_URL(selectedPlaylist.id)}
      />
      <ModeCard image={challengeIcon}
        title="Challenge (WIP)"
        description="Hardcore mode : try to recognize several songs at once !"
        href={HARDCORE_URL(selectedPlaylist.id)}
      />
    </Grid>
  );
}
