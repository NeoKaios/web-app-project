import { Card, CardActionArea, CardContent, CardMedia, SvgIconTypeMap, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export function ModeCard({ image, title, description, href }: { image: JSX.Element, title: string, description: string, href: string }) {
  return (
    <Grid item>
      <Card sx={{ width: 345 }}>
        <CardActionArea href={href}>
          <CardMedia>
            {image}
          </ CardMedia>
          <CardContent>
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
