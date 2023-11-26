import { Bar, Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';

export default function Statistic({ title }) {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

    const data = {
        labels,
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            },
        ],
    };

    return (
        <Card
            sx={{
                minHeight: '100vh',
            }}
            type="section"
        >
            <CardHeader
                title={`${title}`}
                subheader={`Tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`}
            />

            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Line data={data} />
                    </Grid>
                    <Grid item xs={6}>
                        <Bar data={data} />
                    </Grid>
                    <Grid item xs={6}>
                        <Pie data={data} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
