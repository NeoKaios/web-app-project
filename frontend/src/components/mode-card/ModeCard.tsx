import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export function ModeCard({ image, title, description, href }: { image: JSX.Element, title: string, description: string, href: string }) {
  return (
    <Grid item>
      <Card sx={{ width: 300, height: "100%" }}>
        <CardActionArea href={href} sx={{ height: "100%", display: "flex", alignItems: "start" }}>
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
