import os
import openai


from flask import (Flask, redirect, render_template, request,
                   send_from_directory, url_for, session)

app = Flask(__name__)

# insert key
openai_key = os.environ['my_env']
openai.api_key = openai_key
app.secret_key = os.urandom(24)

def generateResponse(user_prompt, user_id): # gpt-3.5
    model_engine = "gpt-3.5-turbo"

    # Get the conversation history from the session
    conversation_history = session.get('conversation_history', [])
    conversation_history.append({"role": "user", "content": user_prompt})

    # Generate a response
    completion = openai.ChatCompletion.create(
        model=model_engine,
        messages=conversation_history,
    )

    # Save the bot's response to the conversation history
    conversation_history.append({"role": "assistant", "content": completion.choices[0].message.content})
    session['conversation_history'] = conversation_history

    response = completion.choices[0].message.content
    return response 


@app.route('/')
def index():
   print('Request for index page received')
   conversation_history = session.get('conversation_history', [])
   conversation_history.append({"role": "assistant", "content": "Guten Tag, mein Name ist Kiki. Wie kann ich Ihnen behilflich sein?"})
   session['conversation_history'] = conversation_history
   return render_template('index.html')


@app.route("/get_bot_1")
def get_bot_1_response():
    # Check if the user has a unique ID and generate one if not
    if 'user_id' not in session:
        session['user_id'] = os.urandom(24).hex()

    userText = request.args.get('msg') 
    print (userText)
    return str(generateResponse(userText, session['user_id']))


if __name__ == '__main__':
   app.run()