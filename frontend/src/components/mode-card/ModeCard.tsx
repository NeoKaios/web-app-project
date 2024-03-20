import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

export function ModeCard({ image, title, description, href }: { image: JSX.Element, title: string, description: string, href: string }) {
  const navigate = useNavigate();
  return (
    <Grid item>
      <Card sx={{ width: 300, height: "100%" }}>
        <CardActionArea onClick={() => navigate(href)} sx={{ height: "100%", display: "flex", alignItems: "start" }}>
        <CardContent sx={{ textAlign: "center" }}>
          <CardMedia>
            {image}
          </ CardMedia>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
