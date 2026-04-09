import { errorResponse, successResponse } from '../../../lib/response';
import { getWeatherSummary } from '../../../lib/weather';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.trim();

  if (!city) {
    return errorResponse('Query parameter "city" is required.', 400);
  }

  const geocodingUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}` +
    '&count=1&language=en&format=json';

  try {
    const geocodingResponse = await fetch(geocodingUrl, { cache: 'no-store' });

    if (!geocodingResponse.ok) {
      return errorResponse('Failed to fetch city coordinates from Open-Meteo.', 502);
    }

    const geocodingData = await geocodingResponse.json();
    const result = geocodingData.results?.[0];

    if (!result) {
      return errorResponse(`City "${city}" was not found.`, 404);
    }

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}` +
      `&longitude=${result.longitude}` +
      '&current=temperature_2m,weather_code&timezone=auto';

    const weatherResponse = await fetch(weatherUrl, { cache: 'no-store' });

    if (!weatherResponse.ok) {
      return errorResponse('Failed to fetch weather data from Open-Meteo.', 502);
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    if (!current) {
      return errorResponse('Weather service returned an unexpected response.', 502);
    }

    const summary = getWeatherSummary(current.weather_code);

    return successResponse(
      {
        city: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
        temperature: current.temperature_2m ?? null,
        condition: summary.condition,
        isRaining: summary.isRaining,
        isSnowing: summary.isSnowing,
      },
      'Weather fetched successfully.'
    );
  } catch {
    return errorResponse('Unable to reach the weather services right now.', 502);
  }
}
