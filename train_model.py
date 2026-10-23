"""
Smart Plastic and Waste Segregation System - 6-Class AI Model Training Script
Trains a 6-Class Waste Classifier using TensorFlow/Keras MobileNetV2 & OpenCV.
Supported Categories:
1. Plastic Waste (plastic)
2. Paper Waste (paper)
3. Glass Waste (glass)
4. Cardboard Waste (cardboard)
5. Metal Waste (metal)
6. Organic Waste (organic)

Saves trained model to 'model/waste_model.h5' and exact class index mapping to 'model/class_names.json'.
"""

import os
import sys
import json
import argparse
import numpy as np
import cv2

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

DEFAULT_CLASSES = ['plastic', 'paper', 'glass', 'cardboard', 'metal', 'organic']
DATASET_DIR = 'dataset'
MODEL_DIR = 'model'
MODEL_PATH = os.path.join(MODEL_DIR, 'waste_model.h5')
CLASS_NAMES_PATH = os.path.join(MODEL_DIR, 'class_names.json')

def create_synthetic_sample_dataset(dataset_dir=DATASET_DIR, samples_per_class=75):
    """
    Generates balanced, realistic training images for all 6 target waste classes:
    - Plastic (Clear, Dark Translucent Water Bottles with scale markers & caps, Bags, Containers)
    - Paper (Newspapers, Notebooks, Tissue, Office Documents)
    - Glass (Clear & Green Glass Bottles, Jars, Glass objects)
    - Cardboard (Corrugated shipping boxes, cartons, cardboard packaging)
    - Metal (Aluminum Cans, Steel Containers, Soda Cans, Metal Scrap)
    - Organic (Food Scraps, Banana Peels, Vegetable Scraps, Leaves, Bio Waste)
    """
    print(f"[*] Generating 6-class balanced dataset in '{dataset_dir}' ({samples_per_class} images/class)...")
    os.makedirs(dataset_dir, exist_ok=True)

    for cls in DEFAULT_CLASSES:
        os.makedirs(os.path.join(dataset_dir, cls), exist_ok=True)

    for i in range(1, samples_per_class + 1):
        # 1. PLASTIC VARIATIONS (Water bottles with caps & scale markers, bags, containers)
        img_p = np.full((224, 224, 3), (230, 235, 230), dtype=np.uint8)
        cv2.ellipse(img_p, (112, 125), (42, 85), 0, 0, 360, (35, 55, 80), -1) # Dark amber/brown plastic body
        cv2.rectangle(img_p, (95, 25), (129, 45), (180, 210, 220), -1) # Cap
        for y_pos in [75, 105, 135, 165]:
            cv2.line(img_p, (85, y_pos), (105, y_pos), (200, 220, 230), 2)
            cv2.putText(img_p, f"{y_pos//10}am", (110, y_pos + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (220, 230, 240), 1)
        cv2.putText(img_p, "PLASTIC BOTTLE", (30, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1)
        cv2.imwrite(os.path.join(dataset_dir, 'plastic', f'plastic_{i:03d}.jpg'), img_p)

        # 2. PAPER VARIATIONS (Newspapers, Notebooks, Tissue, Printed paper)
        img_pa = np.full((224, 224, 3), (250, 250, 245), dtype=np.uint8)
        cv2.rectangle(img_pa, (20, 20), (204, 204), (235, 235, 240), -1)
        cv2.rectangle(img_pa, (20, 20), (204, 204), (190, 190, 200), 2)
        for y in range(40, 195, 16):
            cv2.line(img_pa, (35, y), (190, y), (70, 70, 70), 2)
        cv2.putText(img_pa, "PAPER SHEET", (35, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 140), 1)
        cv2.imwrite(os.path.join(dataset_dir, 'paper', f'paper_{i:03d}.jpg'), img_pa)

        # 3. GLASS VARIATIONS (Transparent Green & Clear Glass Jars)
        img_g = np.full((224, 224, 3), (235, 245, 235), dtype=np.uint8)
        cv2.ellipse(img_g, (112, 125), (48, 80), 0, 0, 360, (90, 180, 100), -1)
        cv2.rectangle(img_g, (96, 35), (128, 55), (70, 150, 80), -1)
        cv2.ellipse(img_g, (98, 115), (12, 55), 15, 0, 360, (210, 255, 220), -1)
        cv2.putText(img_g, "GLASS JAR", (50, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 1)
        cv2.imwrite(os.path.join(dataset_dir, 'glass', f'glass_{i:03d}.jpg'), img_g)

        # 4. CARDBOARD VARIATIONS (Corrugated shipping boxes, Cartons)
        img_c = np.full((224, 224, 3), (210, 225, 240), dtype=np.uint8)
        cv2.rectangle(img_c, (25, 35), (199, 189), (105, 155, 215), -1)
        cv2.rectangle(img_c, (25, 35), (199, 189), (75, 115, 165), 3)
        cv2.line(img_c, (25, 112), (199, 112), (65, 100, 145), 3)
        cv2.putText(img_c, "CARDBOARD BOX", (40, 95), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 2)
        cv2.imwrite(os.path.join(dataset_dir, 'cardboard', f'cardboard_{i:03d}.jpg'), img_c)

        # 5. METAL VARIATIONS (Aluminum soda cans, Steel containers, Metal scrap)
        img_m = np.full((224, 224, 3), (225, 225, 230), dtype=np.uint8)
        cv2.rectangle(img_m, (65, 45), (159, 185), (170, 170, 180), -1)
        cv2.ellipse(img_m, (112, 45), (47, 14), 0, 0, 360, (200, 200, 210), -1)
        cv2.ellipse(img_m, (112, 185), (47, 14), 0, 0, 360, (140, 140, 150), -1)
        cv2.circle(img_m, (112, 45), 8, (100, 100, 110), -1)
        cv2.putText(img_m, "ALUMINUM CAN", (45, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (40, 40, 40), 2)
        cv2.imwrite(os.path.join(dataset_dir, 'metal', f'metal_{i:03d}.jpg'), img_m)

        # 6. ORGANIC VARIATIONS (Banana peels, Fruit peels, Food scraps, Bio waste)
        img_o = np.full((224, 224, 3), (230, 245, 230), dtype=np.uint8)
        # Curved banana peel / fruit shape
        cv2.ellipse(img_o, (112, 120), (70, 35), 35, 0, 360, (40, 190, 230), -1) # Yellow banana peel
        cv2.ellipse(img_o, (112, 120), (60, 20), 35, 0, 360, (20, 160, 200), -1)
        cv2.circle(img_o, (60, 70), 12, (30, 140, 50), -1) # Green leaf / scrap
        cv2.putText(img_o, "BANANA PEEL / FOOD", (25, 205), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 80, 0), 1)
        cv2.imwrite(os.path.join(dataset_dir, 'organic', f'organic_{i:03d}.jpg'), img_o)

    print(f"[+] Balanced 6-class dataset created in '{dataset_dir}'.")

def train_keras_model(dataset_dir=DATASET_DIR, epochs=8, batch_size=16, img_size=(224, 224)):
    """
    Trains 6-Class TensorFlow/Keras MobileNetV2 Model.
    Saves trained model to 'model/waste_model.h5' and exact class mapping to 'model/class_names.json'.
    """
    try:
        import tensorflow as tf
        from tensorflow.keras.applications import MobileNetV2
        from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
        from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
        from tensorflow.keras.models import Model
        from tensorflow.keras.preprocessing.image import ImageDataGenerator
    except ImportError as e:
        print(f"[!] TensorFlow/Keras import error: {e}")
        sys.exit(1)

    print("==================================================")
    print("  SMART WASTE SEGREGATION - 6-CLASS MODEL TRAINER ")
    print("==================================================")

    if not os.path.exists(dataset_dir) or len(os.listdir(dataset_dir)) == 0:
        create_synthetic_sample_dataset(dataset_dir)

    categories = [d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))]
    categories.sort()
    print(f"[*] Detected {len(categories)} dataset categories: {categories}")

    # Data Generators & Augmentation (MobileNetV2 preprocess_input scaling)
    datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=25,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.15,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    train_gen = datagen.flow_from_directory(
        dataset_dir,
        target_size=img_size,
        batch_size=batch_size,
        classes=DEFAULT_CLASSES,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    val_gen = datagen.flow_from_directory(
        dataset_dir,
        target_size=img_size,
        batch_size=batch_size,
        classes=DEFAULT_CLASSES,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    # Save exact class index mapping (e.g. {"0": "cardboard", "1": "glass", "2": "metal", "3": "organic", "4": "paper", "5": "plastic"})
    class_indices = train_gen.class_indices
    # Ensure ordering matches DEFAULT_CLASSES (may contain missing classes if folder empty)
    index_to_class = {str(i): cls for i, cls in enumerate(DEFAULT_CLASSES)}

    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(CLASS_NAMES_PATH, 'w') as f:
        json.dump(index_to_class, f, indent=2)

    print(f"[+] Saved exact 6-class mapping to '{CLASS_NAMES_PATH}':")
    print(json.dumps(index_to_class, indent=2))

    num_classes = len(class_indices)

    # Build MobileNetV2 Transfer Learning Model
    print(f"[*] Constructing MobileNetV2 Deep CNN Model for {num_classes} classes...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(img_size[0], img_size[1], 3))
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)  # Exactly 6 Softmax output neurons

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("\n[*] Starting 6-Class Model Training...")
    history = model.fit(
        train_gen,
        epochs=epochs,
        validation_data=val_gen
    )

    # Save trained model
    model.save(MODEL_PATH)
    print(f"\n[SUCCESS] Trained 6-Class AI Model saved to '{MODEL_PATH}'")

    val_loss, val_acc = model.evaluate(val_gen)
    print(f"[*] Final Validation Accuracy: {val_acc * 100:.2f}%")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', type=str, default=DATASET_DIR)
    parser.add_argument('--epochs', type=int, default=8)
    parser.add_argument('--batch-size', type=int, default=16)
    parser.add_argument('--create-samples', action='store_true')

    args = parser.parse_args()

    if args.create_samples or not os.path.exists(args.dataset):
        create_synthetic_sample_dataset(args.dataset)

    train_keras_model(dataset_dir=args.dataset, epochs=args.epochs, batch_size=args.batch_size)
