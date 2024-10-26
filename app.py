import google.generativeai as genai

genai.configure(api_key='AIzaSyBZF0AYGqxvrS6LantjECwGand65x2RYxU')

def chatbot_response(prompt):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text

# Chat loop
print("Chatbot is ready! Type 'exit' to stop.")
while True:
    user_input = input("You: ")
    if user_input.lower() == 'exit':
        print("Chatbot: Goodbye!")
        break
    reply = chatbot_response(user_input)
    print(f"Chatbot: {reply}")
    # Store the conversation history
    # conversation_history = []
    # conversation_history.append(f"User: {user_input}")
    # conversation_history.append(f"Chatbot: {reply}")
    
    # Optionally, limit the history to the last N exchanges
    # max_history = 10
    # if len(conversation_history) > max_history * 2:
    #     conversation_history = conversation_history[-max_history * 2:]
    
    # Print the entire conversation history (for debugging)
    # print("\nConversation History:")
    # for message in conversation_history:
    #     print(message)
