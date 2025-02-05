from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

# Route for users to access the map and features
@app.route('/')
def user_interface():
    return render_template('user_interface.html')

# Route for collectors to manage bins
@app.route('/collector')
def collector_interface():
    return render_template('bin_collector.html')

# Fetch bin data from the database
@app.route('/get_bins')
def get_bins():
    conn = sqlite3.connect('bin_data.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, level, status, latitude, longitude FROM waste_data")
    bins = cursor.fetchall()
    conn.close()
    return jsonify({"bins": bins})
@app.route('/get_bins')

# Update bin status
@app.route('/update_status', methods=['POST'])
def update_status():
    bin_id = request.form.get('id')
    status = request.form.get('status')
    conn = sqlite3.connect('bin_data.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE waste_data SET status = ? WHERE id = ?", (status, bin_id))
    conn.commit()
    conn.close()
    return "Status updated successfully", 200

# Add new bin (for collectors)
@app.route('/add_bin', methods=['POST'])
def add_bin():
    level = request.form.get('level')
    status = request.form.get('status')
    latitude = float(request.form.get('latitude'))
    longitude = float(request.form.get('longitude'))

    conn = sqlite3.connect('bin_data.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO waste_data (level, status, latitude, longitude) VALUES (?, ?, ?, ?)",
                   (level, status, latitude, longitude))
    conn.commit()
    conn.close()
    return "Bin added successfully", 200

if __name__ == '__main__':
    app.run(debug=True)
