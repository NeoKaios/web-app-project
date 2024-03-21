import { Grid } from "@mui/material";
import { ModeCard } from "..";
import BookIcon from '@mui/icons-material/Book';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { STUDY_URL } from "../../lib/consts";
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
        href={STUDY_URL + "/" + selectedPlaylist.id.toString()}
      />
      <ModeCard image={trainingIcon}
        title="Training"
        description="Train yourself in a quizz-like fashion"
        href=""
      />
      <ModeCard image={challengeIcon}
        title="Challenge"
        description="Hardcore mode : try to recognize several songs at once !"
        href=""
      />
    </Grid>
  );
}
