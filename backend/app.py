import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React

# Load the model and vectorizer
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)
with open('vectorizer.pkl', 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Transform the input using the vectorizer
    transformed_text = vectorizer.transform([text])
    prediction = model.predict(transformed_text)

    # Return the prediction
    return jsonify({"prediction": "spam" if prediction[0] == 1 else "not spam"})

if __name__ == '__main__':
    app.run(debug=True)
