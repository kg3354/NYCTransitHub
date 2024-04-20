import openai
import json
import os

# Ensure your OPENAI_API_KEY is set in your environment variables
openai.api_key = "sk-proj-EGkBZA3TvYbKxqwcNCvPT3BlbkFJhdd63L3HV6bAk23AM6Qv"


def get_clothing_recommendation(temp, condition, humidity):
    # Define the system's role
    system_prompt = "You are an assistant skilled in providing clothing recommendations based on weather conditions."

    # Define the user's prompt with the provided temperature, condition, and humidity
    user_prompt = f"What should I wear and should I be aware of rain? The current temperature is {temp} degrees Celsius, the weather condition is {condition}, and the humidity is {humidity}%."

    # Make the API request
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    # Return the assistant's response as a JSON string
    return json.dumps(completion.choices[0].message, indent=2)

# Example usage
temperature = 20  # Celsius
weather_condition = "cloudy"
humidity_level = 85  # Percentage

recommendation = get_clothing_recommendation(temperature, weather_condition, humidity_level)
print(recommendation)
