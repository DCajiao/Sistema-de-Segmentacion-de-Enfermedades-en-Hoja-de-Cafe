FROM python:3.13-slim

WORKDIR /app

# Install uv via pip
RUN pip install --no-cache-dir uv

# Just copy the lock file to leverage Docker cache
COPY pyproject.toml ./

# Install defined dependencies in pyproject.toml
# Then swap opencv-python (requires X11/libxcb) for the headless variant
RUN uv pip install -r pyproject.toml --system && \
    uv pip uninstall opencv-python --system && \
    uv pip install opencv-python-headless --system

# Copy the rest of the project
COPY . ./
EXPOSE 8000
CMD ["python", "main.py"]